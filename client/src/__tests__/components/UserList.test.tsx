import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import UserList from '../../components/UserList'
import { getUsers } from '../../api/userApi'

vi.mock('../../api/userApi', () => ({
  getUsers: vi.fn(),
  deleteUser: vi.fn(),
}))

describe('UserList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading spinner on initial mount', () => {
    vi.mocked(getUsers).mockResolvedValue([])
    render(<UserList />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders users in table after loading', async () => {
    vi.mocked(getUsers).mockResolvedValue([
      { id: 1, name: 'Alice', email: 'alice@test.com', password: 'x' },
      { id: 2, name: 'Bob', email: 'bob@test.com', password: 'y' },
    ])
    render(<UserList />)
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('bob@test.com')).toBeInTheDocument()
    })
  })

  it('shows empty state message when no users exist', async () => {
    vi.mocked(getUsers).mockResolvedValue([])
    render(<UserList />)
    await waitFor(() => {
      expect(screen.getByText(/no users found/i)).toBeInTheDocument()
    })
  })

  it('shows error alert when API call fails', async () => {
    vi.mocked(getUsers).mockRejectedValue(new Error('Network error'))
    render(<UserList />)
    await waitFor(() => {
      expect(screen.getByText(/failed to load users/i)).toBeInTheDocument()
    })
  })

  it('renders table column headers', async () => {
    vi.mocked(getUsers).mockResolvedValue([
      { id: 1, name: 'Alice', email: 'alice@test.com', password: 'x' },
    ])
    render(<UserList />)
    await waitFor(() => {
      expect(screen.getByText('ID')).toBeInTheDocument()
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
    })
  })
})
