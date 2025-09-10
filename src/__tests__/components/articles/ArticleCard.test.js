// ===============================================
// 📁 src/__tests__/components/articles/ArticleCard.test.js
import { render, screen } from '@testing-library/react'
import ArticleCard from '@/components/articles/ArticleCard'

describe('ArticleCard', () => {
  const mockArticle = {
    title: 'Test Article',
    content: '<p>This is a test article</p>',
    readTime: '5 min',
    imageColor: 'bg-blue-100',
    href: '/articles/test-article',
    author: { name: 'John Doe' },
    publishedAt: '2024-01-15',
    category: { name: 'Tech' }
  }

  it('renders article information correctly', () => {
    render(<ArticleCard {...mockArticle} />)

    expect(screen.getByText('Test Article')).toBeInTheDocument()
    expect(screen.getByText('This is a test article')).toBeInTheDocument()
    expect(screen.getByText('5 min')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Tech')).toBeInTheDocument()
  })

  it('renders in horizontal layout when specified', () => {
    const { container } = render(
      <ArticleCard {...mockArticle} horizontal={true} />
    )

    expect(container.querySelector('.flex.items-start.space-x-6')).toBeInTheDocument()
  })

  it('handles missing optional props gracefully', () => {
    const minimalArticle = {
      title: 'Minimal Article',
      href: '/articles/minimal'
    }

    render(<ArticleCard {...minimalArticle} />)
    expect(screen.getByText('Minimal Article')).toBeInTheDocument()
  })
})