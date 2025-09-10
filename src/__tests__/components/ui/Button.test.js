// ===============================================
// 📁 src/__tests__/components/ui/Button.test.js
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
    it('renders with default props', () => {
        render(<Button>Click me</Button>)
        const button = screen.getByRole('button', { name: /click me/i })
        expect(button).toBeInTheDocument()
        expect(button).toHaveClass('bg-gray-900', 'text-white')
    })

    it('renders with different variants', () => {
        const { rerender } = render(<Button variant="secondary">Secondary</Button>)
        expect(screen.getByRole('button')).toHaveClass('bg-white', 'text-gray-700')

        rerender(<Button variant="outline">Outline</Button>)
        expect(screen.getByRole('button')).toHaveClass('border', 'bg-transparent')

        rerender(<Button variant="ghost">Ghost</Button>)
        expect(screen.getByRole('button')).toHaveClass('text-gray-700')
    })

    it('renders with different sizes', () => {
        const { rerender } = render(<Button size="sm">Small</Button>)
        expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5')

        rerender(<Button size="md">Medium</Button>)
        expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2')

        rerender(<Button size="lg">Large</Button>)
        expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3')
    })

    it('handles disabled state', () => {
        render(<Button disabled>Disabled</Button>)
        const button = screen.getByRole('button')
        expect(button).toBeDisabled()
        expect(button).toHaveClass('disabled:opacity-50')
    })

    it('handles loading state', () => {
        render(<Button isLoading loadingText="Saving...">Save</Button>)
        const button = screen.getByRole('button')
        expect(button).toBeDisabled()
        expect(screen.getByText('Saving...')).toBeInTheDocument()
        expect(button).toHaveClass('cursor-not-allowed')
    })

    it('renders with icon', () => {
        const icon = <span data-testid="icon">🔥</span>
        render(<Button icon={icon}>With Icon</Button>)
        expect(screen.getByTestId('icon')).toBeInTheDocument()
        expect(screen.getByText('With Icon')).toBeInTheDocument()
    })

    it('applies custom className', () => {
        render(<Button className="custom-class">Custom</Button>)
        expect(screen.getByRole('button')).toHaveClass('custom-class')
    })

    it('forwards ref correctly', () => {
        const ref = { current: null }
        render(<Button ref={ref}>Ref Test</Button>)
        expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })
})