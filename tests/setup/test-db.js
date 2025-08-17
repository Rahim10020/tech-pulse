// ===============================================
// 📁 tests/setup/test-db.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/techpulse_test'
    }
  }
})

export async function setupTestDB() {
  // Nettoyer la base de données
  await prisma.like.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.article.deleteMany()
  await prisma.user.deleteMany()
  await prisma.category.deleteMany()
  await prisma.tag.deleteMany()

  console.log('✅ Test database cleaned')
}

export async function teardownTestDB() {
  await prisma.$disconnect()
}

export { prisma }