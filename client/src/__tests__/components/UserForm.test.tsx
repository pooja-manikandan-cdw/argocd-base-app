import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UserForm from '../../components/UserForm'
import type { User } from '../../types/user'

vi.mock('../../api/userApi', () => ({
  createUser: vi.fn().mockResolvedValue({ id: 1, name: 'Test', email: 't@t.com', password: 'x' }),
  updateUser: vi.fn().mockResolvedValue({ message: 'User updated successfully' }),
}))

const mockUser: User = { id: 1, name: 'Alice', email: 'alice@test.com', password: 'x' }

describe('UserForm', () => {
  it('shows "Create User" title when editUser is null', () => {
    render(<UserForm open editUser={null} onClose={vi.fn()} onSaved={vi.fn()} />)
    expect(screen.getByText('Create User')).toBeInTheDocument()
  })

  it('shows "Edit User" title when editUser is provided', () => {
    render(<UserForm open editUser={mockUser} onClose={vi.fn()} onSaved={vi.fn()} />)
    expect(screen.getByText('Edit User')).toBeInTheDocument()
  })

  it('shows password field in create mode', () => {
    render(<UserForm open editUser={null} onClose={vi.fn()} onSaved={vi.fn()} />)
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('hides password field in edit mode', () => {
    render(<UserForm open editUser={mockUser} onClose={vi.fn()} onSaved={vi.fn()} />)
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument()
  })

  it('pre-fills name and email fields in edit mode', () => {
    render(<UserForm open editUser={mockUser} onClose={vi.fn()} onSaved={vi.fn()} />)
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument()
    expect(screen.getByDisplayValue('alice@test.com')).toBeInTheDocument()
  })

  it('shows validation error when submitting empty create form', async () => {
    render(<UserForm open editUser={null} onClose={vi.fn()} onSaved={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /create/i }))
    await waitFor(() => {
      expect(screen.getByText(/fill in all required fields/i)).toBeInTheDocument()
    })
  })

  it('calls onClose when Cancel is clicked', () => {
    const onClose = vi.fn()
    render(<UserForm open editUser={null} onClose={onClose} onSaved={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
