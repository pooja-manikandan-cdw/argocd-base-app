import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { getUsers, createUser, updateUser, deleteUser } from '../../api/userApi'

vi.mock('axios')

describe('userApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getUsers calls GET /users/ and returns data', async () => {
    const mockUsers = [{ id: 1, name: 'Alice', email: 'alice@test.com', password: 'x' }]
    vi.mocked(axios.get).mockResolvedValue({ data: mockUsers })

    const result = await getUsers()

    expect(axios.get).toHaveBeenCalledWith('/users/')
    expect(result).toEqual(mockUsers)
  })

  it('createUser calls POST /users/ with payload', async () => {
    const payload = { name: 'Bob', email: 'bob@test.com', password: 'pass' }
    vi.mocked(axios.post).mockResolvedValue({ data: { id: 2, ...payload } })

    const result = await createUser(payload)

    expect(axios.post).toHaveBeenCalledWith('/users/', payload)
    expect(result.name).toBe('Bob')
    expect(result.email).toBe('bob@test.com')
  })

  it('updateUser calls PUT /users/:id with payload', async () => {
    vi.mocked(axios.put).mockResolvedValue({ data: { message: 'User updated successfully' } })

    const result = await updateUser(1, { name: 'Updated', email: 'updated@test.com' })

    expect(axios.put).toHaveBeenCalledWith('/users/1', { name: 'Updated', email: 'updated@test.com' })
    expect(result.message).toBe('User updated successfully')
  })

  it('deleteUser calls DELETE /users/:id', async () => {
    vi.mocked(axios.delete).mockResolvedValue({ data: { message: 'User deleted successfully' } })

    const result = await deleteUser(1)

    expect(axios.delete).toHaveBeenCalledWith('/users/1')
    expect(result.message).toBe('User deleted successfully')
  })

  it('getUsers propagates API errors', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Network Error'))

    await expect(getUsers()).rejects.toThrow('Network Error')
  })
})
