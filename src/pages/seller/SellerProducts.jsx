import { useState, useEffect } from 'react'
import {
  Box, Container, Typography, Button, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Navbar from '../../components/Navbar'
import API from '../../utils/api'
import { toast } from 'react-toastify'

const emptyForm = {
  title: '', description: '', price: '',
  stock: '', category_id: '', image: null
}

export default function SellerProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products/seller')
      setProducts(res.data)
    } catch (err) {
      toast.error('Failed to load products!')
    }
  }

  const fetchCategories = async () => {
    const res = await API.get('/categories')
    setCategories(res.data)
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const handleSubmit = async () => {
    if (!form.title || !form.price) return toast.error('Title and price required!')
    setLoading(true)
    try {
      const data = new FormData()
      Object.keys(form).forEach(key => {
        if (form[key] !== null && form[key] !== '') data.append(key, form[key])
      })
      if (editId) {
        await API.put(`/products/${editId}`, data)
        toast.success('Product updated!')
      } else {
        await API.post('/products', data)
        toast.success('Product created!')
      }
      setOpen(false)
      setForm(emptyForm)
      setEditId(null)
      fetchProducts()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed!')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setForm({
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category_id: product.category_id,
      image: null
    })
    setEditId(product.id)
    setOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await API.delete(`/products/${id}`)
      toast.success('Product deleted!')
      fetchProducts()
    } catch (err) {
      toast.error('Failed to delete!')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">My Products</Typography>
          <Button variant="contained" startIcon={<AddIcon />}
            onClick={() => { setForm(emptyForm); setEditId(null); setOpen(true) }}>
            Add Product
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ background: '#1976d2' }}>
              <TableRow>
                {['Image', 'Title', 'Price', 'Stock', 'Category', 'Status', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ color: 'white', fontWeight: 'bold' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(product => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Box component="img"
                      src={product.image
                        ? `http://localhost:5000${product.image}`
                        : 'https://via.placeholder.com/50'}
                      sx={{ width: 50, height: 50, borderRadius: 1, objectFit: 'cover' }}
                    />
                  </TableCell>
                  <TableCell><Typography fontWeight="bold">{product.title}</Typography></TableCell>
                  <TableCell>₹{Number(product.price).toLocaleString()}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.category_name}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.is_active ? 'Active' : 'Inactive'}
                      color={product.is_active ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(product)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(product.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField label="Title *" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} fullWidth />
            <TextField label="Description" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              fullWidth multiline rows={3} />
            <TextField label="Price *" type="number" value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })} fullWidth />
            <TextField label="Stock" type="number" value={form.stock}
              onChange={e => setForm({ ...form, stock: e.target.value })} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={form.category_id}
                onChange={e => setForm({ ...form, category_id: e.target.value })}
                label="Category">
                {categories.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="outlined" component="label">
              Upload Image
              <input type="file" hidden accept="image/*"
                onChange={e => setForm({ ...form, image: e.target.files[0] })} />
            </Button>
            {form.image && (
              <Typography variant="caption" color="success.main">
                ✅ {form.image.name}
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : editId ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}