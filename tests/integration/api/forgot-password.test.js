import { createMocks } from 'node-mocks-http'
import { POST as forgotPasswordHandler } from '@/app/api/auth/forgot-password/route'
import { POST as verifyResetCodeHandler } from '@/app/api/auth/verify-reset-code/route'
import { POST as resetPasswordHandler } from '@/app/api/auth/reset-password/route'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

describe('/api/auth/forgot-password', () => {
    beforeAll(async () => {
        await prisma.$connect()
    })

    afterAll(async () => {
        await prisma.$disconnect()
    })

    beforeEach(async () => {
        // Create test user
        const hashedPassword = await bcrypt.hash('testpassword', 12)
        await prisma.user.create({
            data: {
                name: 'Test User',
                username: 'testuser',
                email: 'test@example.com',
                password: hashedPassword,
                role: 'reader'
            }
        })
    })

    afterEach(async () => {
        // Clean up after each test
        await prisma.passwordResetCode.deleteMany()
        await prisma.user.deleteMany()
    })

    it('should generate reset code for existing user', async () => {
        const request = new Request('http://localhost:3000/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com'
            })
        })

        const response = await forgotPasswordHandler(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.message).toContain('code de réinitialisation')
    })

    it('should return success message for non-existing user (security)', async () => {
        const request = new Request('http://localhost:3000/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'nonexistent@example.com'
            })
        })

        const response = await forgotPasswordHandler(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.message).toContain('code de réinitialisation')
    })

    it('should fail with invalid email format', async () => {
        const request = new Request('http://localhost:3000/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'invalid-email'
            })
        })

        const response = await forgotPasswordHandler(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Format d\'email invalide')
    })

    it('should fail with missing email', async () => {
        const request = new Request('http://localhost:3000/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        })

        const response = await forgotPasswordHandler(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Email requis')
    })
})

describe('Complete forgot password flow', () => {
    let resetCode = ''

    beforeAll(async () => {
        await prisma.$connect()
    })

    afterAll(async () => {
        await prisma.$disconnect()
    })

    beforeEach(async () => {
        // Create test user
        const hashedPassword = await bcrypt.hash('testpassword', 12)
        await prisma.user.create({
            data: {
                name: 'Test User',
                username: 'testuser',
                email: 'test@example.com',
                password: hashedPassword,
                role: 'reader'
            }
        })

        // Generate reset code
        const request = new Request('http://localhost:3000/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com'
            })
        })

        await forgotPasswordHandler(request)

        // Get the generated code from database
        const codeRecord = await prisma.passwordResetCode.findFirst({
            where: { email: 'test@example.com' }
        })
        resetCode = codeRecord.code
    })

    afterEach(async () => {
        await prisma.passwordResetCode.deleteMany()
        await prisma.user.deleteMany()
    })

    it('should complete full password reset flow', async () => {
        // Step 1: Verify reset code
        const verifyRequest = new Request('http://localhost:3000/api/auth/verify-reset-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                code: resetCode
            })
        })

        const verifyResponse = await verifyResetCodeHandler(verifyRequest)
        const verifyData = await verifyResponse.json()

        expect(verifyResponse.status).toBe(200)
        expect(verifyData.success).toBe(true)

        // Step 2: Reset password
        const resetRequest = new Request('http://localhost:3000/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                code: resetCode,
                password: 'newpassword123'
            })
        })

        const resetResponse = await resetPasswordHandler(resetRequest)
        const resetData = await resetResponse.json()

        expect(resetResponse.status).toBe(200)
        expect(resetData.success).toBe(true)

        // Verify password was actually changed
        const user = await prisma.user.findUnique({
            where: { email: 'test@example.com' }
        })

        const isNewPasswordValid = await bcrypt.compare('newpassword123', user.password)
        expect(isNewPasswordValid).toBe(true)
    })

    it('should fail with expired code', async () => {
        // Update code to be expired
        await prisma.passwordResetCode.updateMany({
            where: { email: 'test@example.com' },
            data: {
                expiresAt: new Date(Date.now() - 1000) // Expired 1 second ago
            }
        })

        const verifyRequest = new Request('http://localhost:3000/api/auth/verify-reset-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                code: resetCode
            })
        })

        const verifyResponse = await verifyResetCodeHandler(verifyRequest)
        const verifyData = await verifyResponse.json()

        expect(verifyResponse.status).toBe(400)
        expect(verifyData.error).toBe('Code expiré')
    })

    it('should fail with invalid code', async () => {
        const verifyRequest = new Request('http://localhost:3000/api/auth/verify-reset-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                code: '000000'
            })
        })

        const verifyResponse = await verifyResetCodeHandler(verifyRequest)
        const verifyData = await verifyResponse.json()

        expect(verifyResponse.status).toBe(400)
        expect(verifyData.error).toBe('Code invalide ou expiré')
    })
})