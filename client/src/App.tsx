import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  CssBaseline,
  Box,
} from '@mui/material'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import UserList from './components/UserList'

export default function App() {
  return (
    <>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <PeopleAltIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            User Manager app pooja
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box mt={4}>
          <UserList />
        </Box>
      </Container>
    </>
  )
}
