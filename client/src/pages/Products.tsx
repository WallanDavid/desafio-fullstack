import { useEffect, useState } from 'react'
import { Paper, Typography, Stack, TextField, Button, Divider, List, ListItem, ListItemText } from '@mui/material'
import { api, getToken } from '../api'
import ProductForm from '../components/ProductForm'

type Product = {
  id: number
  user_id: number
  name: string
  description: string | null
  price: number
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [q, setQ] = useState('')
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined)
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const load = async () => {
    const list = await api.listProducts({ q, minPrice, maxPrice })
    setProducts(list)
  }
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const canEdit = Boolean(getToken())

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField label="Buscar" value={q} onChange={e => setQ(e.target.value)} />
          <TextField label="Min" type="number" value={minPrice ?? ''} onChange={e => setMinPrice(e.target.value ? Number(e.target.value) : undefined)} />
          <TextField label="Max" type="number" value={maxPrice ?? ''} onChange={e => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)} />
          <Button variant="outlined" onClick={load}>Filtrar</Button>
          {canEdit && <Button variant="contained" onClick={() => setCreateOpen(true)}>Novo Produto</Button>}
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Produtos</Typography>
        <Divider sx={{ my: 1 }} />
        <List>
          {products.map(p => (
            <ListItem key={p.id} secondaryAction={
              canEdit ? (
                <Stack direction="row" spacing={1}>
                  <Button size="small" onClick={() => setEditing(p)}>Editar</Button>
                  <Button size="small" color="error" onClick={async () => { await api.deleteProduct(p.id); await load() }}>Remover</Button>
                </Stack>
              ) : undefined
            }>
              <ListItemText primary={`${p.name} - R$ ${p.price.toFixed(2)}`} secondary={p.description || ''} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {createOpen && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Novo Produto</Typography>
          <ProductForm onSubmit={async data => { await api.createProduct(data); setCreateOpen(false); await load() }} />
        </Paper>
      )}

      {editing && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Editar Produto</Typography>
          <ProductForm
            initial={{ name: editing.name, description: editing.description ?? undefined, price: editing.price }}
            onSubmit={async data => {
              await api.updateProduct(editing.id, data)
              setEditing(null)
              await load()
            }}
          />
        </Paper>
      )}
    </Stack>
  )
}
