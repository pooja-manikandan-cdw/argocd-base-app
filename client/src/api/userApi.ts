import axios from 'axios'
import type { User, UserCreate, UserUpdate } from '../types/user'

// In dev: empty string → relative URL → Vite proxy handles it
// In Docker: set VITE_API_BASE_URL build arg (e.g. http://localhost:8000)
const BASE = `${import.meta.env.VITE_API_BASE_URL ?? ''}/users`

export const getUsers = (): Promise<User[]> =>
  axios.get<User[]>(`${BASE}/`).then((r) => r.data)

export const getUserById = (id: number): Promise<User> =>
  axios.get<User>(`${BASE}/${id}`).then((r) => r.data)

export const createUser = (payload: UserCreate): Promise<User> =>
  axios.post<User>(`${BASE}/`, payload).then((r) => r.data)

export const updateUser = (
  id: number,
  payload: UserUpdate,
): Promise<{ message: string }> =>
  axios.put<{ message: string }>(`${BASE}/${id}`, payload).then((r) => r.data)

export const deleteUser = (id: number): Promise<{ message: string }> =>
  axios
    .delete<{ message: string }>(`${BASE}/${id}`)
    .then((r) => r.data)
