import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DeleteConfirmDialog from '../../components/DeleteConfirmDialog'
import type { User } from '../../types/user'

const mockUser: User = { id: 1, name: 'Alice', email: 'alice@test.com', password: 'x' }

describe('DeleteConfirmDialog', () => {
  it('renders user name and email in confirmation text', () => {
    render(
      <DeleteConfirmDialog open user={mockUser} onClose={vi.fn()} onConfirm={vi.fn()} />,
    )
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText(/alice@test\.com/)).toBeInTheDocument()
  })

  it('calls onConfirm when Delete button is clicked', () => {
    const onConfirm = vi.fn()
    render(
      <DeleteConfirmDialog open user={mockUser} onClose={vi.fn()} onConfirm={onConfirm} />,
    )
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onClose when Cancel button is clicked', () => {
    const onClose = vi.fn()
    render(
      <DeleteConfirmDialog open user={mockUser} onClose={onClose} onConfirm={vi.fn()} />,
    )
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not render dialog content when open is false', () => {
    render(
      <DeleteConfirmDialog open={false} user={mockUser} onClose={vi.fn()} onConfirm={vi.fn()} />,
    )
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
  })
})
