import { useState } from 'react'
import { TextField, Button, Paper, Typography, Stack } from '@mui/material'
import { api } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const submit = async () => {
    setError(null)
    try {
      await api.login({ email, password })
      navigate('/')
    } catch (e: any) {
      setError('Credenciais inválidas')
    }
  }
  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      <Stack spacing={2}>
        <Typography variant="h6">Login</Typography>
        <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
        <TextField label="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" onClick={submit}>Entrar</Button>
      </Stack>
    </Paper>
  )
}

