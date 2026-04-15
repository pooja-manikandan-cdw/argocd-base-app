import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
} from '@mui/material'
import type { User, UserCreate, UserUpdate } from '../types/user'
import { createUser, updateUser } from '../api/userApi'

interface Props {
  open: boolean
  editUser: User | null
  onClose: () => void
  onSaved: () => void
}

export default function UserForm({ open, editUser, onClose, onSaved }: Props) {
  const isEdit = editUser !== null

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setName(editUser?.name ?? '')
      setEmail(editUser?.email ?? '')
      setPassword('')
      setError(null)
    }
  }, [open, editUser])

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || (!isEdit && !password.trim())) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      if (isEdit) {
        const payload: UserUpdate = { name: name.trim(), email: email.trim() }
        await updateUser(editUser!.id, payload)
      } else {
        const payload: UserCreate = {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        }
        await createUser(payload)
      }
      onSaved()
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Something went wrong.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'Edit User' : 'Create User'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          {!isEdit && (
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {isEdit ? 'Save Changes' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
