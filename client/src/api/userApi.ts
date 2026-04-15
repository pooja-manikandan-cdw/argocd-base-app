import axios from 'axios'
import type { User, UserCreate, UserUpdate } from '../types/user'

const BASE = '/users'

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
