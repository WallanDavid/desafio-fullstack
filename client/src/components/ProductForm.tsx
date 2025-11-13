import { useState } from 'react'
import { TextField, Button, Stack } from '@mui/material'

export default function ProductForm({
  initial,
  onSubmit
}: {
  initial?: { name: string; description?: string; price: number }
  onSubmit: (data: { name: string; description?: string; price: number }) => void
}) {
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [price, setPrice] = useState(initial?.price ?? 0)
  return (
    <Stack spacing={2}>
      <TextField label="Nome" value={name} onChange={e => setName(e.target.value)} fullWidth />
      <TextField label="Descrição" value={description} onChange={e => setDescription(e.target.value)} fullWidth />
      <TextField label="Preço" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} fullWidth />
      <Button variant="contained" onClick={() => onSubmit({ name, description, price })}>Salvar</Button>
    </Stack>
  )
}

