import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Box,
  Chip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { User } from '../types/user'
import { getUsers, deleteUser } from '../api/userApi'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import UserForm from './UserForm'

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [editTarget, setEditTarget] = useState<User | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const data = await getUsers()
      setUsers(data)
    } catch {
      setFetchError('Failed to load users. Is the API server running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleEditClick = (user: User) => {
    setEditTarget(user)
    setFormOpen(true)
  }

  const handleCreateClick = () => {
    setEditTarget(null)
    setFormOpen(true)
  }

  const handleFormClose = () => setFormOpen(false)
  const handleFormSaved = () => {
    setFormOpen(false)
    loadUsers()
  }

  const handleDeleteClick = (user: User) => {
    setDeleteTarget(user)
    setDeleteOpen(true)
  }

  const handleDeleteClose = () => setDeleteOpen(false)
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      await deleteUser(deleteTarget.id)
      setDeleteOpen(false)
      loadUsers()
    } catch {
      setDeleteOpen(false)
    }
  }

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Chip
          label="+ New User"
          color="primary"
          clickable
          onClick={handleCreateClick}
          sx={{ fontWeight: 600, px: 1 }}
        />
      </Box>

      {fetchError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {fetchError}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary' }}>
                    No users found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(user)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <UserForm
        open={formOpen}
        editUser={editTarget}
        onClose={handleFormClose}
        onSaved={handleFormSaved}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        user={deleteTarget}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
