import { useState } from 'react'
import { TextField, Button, Paper, Typography, Stack } from '@mui/material'
import { api } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const submit = async () => {
    setError(null)
    try {
      await api.register({ username, email, password })
      navigate('/login')
    } catch (e: any) {
      setError('Erro ao cadastrar')
    }
  }
  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      <Stack spacing={2}>
        <Typography variant="h6">Cadastro</Typography>
        <TextField label="Usuário" value={username} onChange={e => setUsername(e.target.value)} fullWidth />
        <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
        <TextField label="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" onClick={submit}>Cadastrar</Button>
      </Stack>
    </Paper>
  )
}

