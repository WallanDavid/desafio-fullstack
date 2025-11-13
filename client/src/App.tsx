import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import { getToken, clearToken } from './api'

export default function App() {
  const navigate = useNavigate()
  const token = getToken()
  const logout = () => {
    clearToken()
    navigate('/login')
  }
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Produtos</Typography>
          {!token ? (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Cadastro</Button>
            </>
          ) : (
            <Button color="inherit" onClick={logout}>Sair</Button>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3 }}>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Container>
    </>
  )
}

