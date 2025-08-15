// ===============================================
// 📁 tests/integration/api/articles.test.js
import { createMocks } from 'node-mocks-http'
import { GET as articlesHandler } from '@/app/api/articles/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('/api/articles', () => {
  beforeAll(async () => {
    await prisma.$connect()
    
    // Create test data
    const category = await prisma.category.create({
      data: {
        name: 'Test Category',
        slug: 'test-category'
      }
    })

    const user = await prisma.user.create({
      data: {
        name: 'Test Author',
        username: 'testauthor',
        email: 'author@test.com',
        password: 'hashedpassword',
        role: 'admin'
      }
    })

    await prisma.article.create({
      data: {
        title: 'Test Article',
        slug: 'test-article',
        content: 'This is test content',
        description: 'Test description',
        published: true,
        authorId: user.id,
        categoryId: category.id
      }
    })
  })

  afterAll(async () => {
    await prisma.article.deleteMany()
    await prisma.user.deleteMany()
    await prisma.category.deleteMany()
    await prisma.$disconnect()
  })

  it('should return published articles', async () => {
    const url = new URL('http://localhost:3000/api/articles?type=all')
    const request = new Request(url, { method: 'GET' })

    const response = await articlesHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.articles).toHaveLength(1)
    expect(data.articles[0].title).toBe('Test Article')
    expect(data.articles[0].published).toBe(true)
  })

  it('should filter articles by category', async () => {
    const url = new URL('http://localhost:3000/api/articles?type=all&category=test-category')
    const request = new Request(url, { method: 'GET' })

    const response = await articlesHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.articles).toHaveLength(1)
    expect(data.articles[0].category.slug).toBe('test-category')
  })
})