// ===============================================
// 📁 tests/integration/api/auth.test.js
import { createMocks } from 'node-mocks-http'
import { POST as loginHandler } from '@/app/api/auth/login/route'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

describe('/api/auth/login', () => {
  beforeAll(async () => {
    // Setup test database
    await prisma.$connect()
  })

  afterAll(async () => {
    // Cleanup test database
    await prisma.user.deleteMany()
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
    await prisma.user.deleteMany()
  })

  it('should login successfully with valid credentials', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword'
      })
    })

    const response = await loginHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.user.email).toBe('test@example.com')
    expect(data.user.password).toBeUndefined() // Password should not be returned
  })

  it('should fail with invalid credentials', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    })

    const response = await loginHandler(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Identifiants invalides')
  })

  it('should fail with non-existent user', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'password'
      })
    })

    const response = await loginHandler(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
  })
})