import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, CircularProgress,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material'
import API from '../utils/api'

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    role: 'buyer', company_name: '', phone: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await API.post('/auth/register', form)
      setSuccess('Account created! Redirecting to login...')
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Register failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
      py: 4
    }}>
      <Card sx={{ width: 450, borderRadius: 3, boxShadow: 10 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
            Create Account
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Full Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              sx={{ mb: 2 }} required />
            <TextField fullWidth label="Email" type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              sx={{ mb: 2 }} required />
            <TextField fullWidth label="Password" type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              sx={{ mb: 2 }} required />
            <TextField fullWidth label="Company Name"
              value={form.company_name}
              onChange={e => setForm({ ...form, company_name: e.target.value })}
              sx={{ mb: 2 }} />
            <TextField fullWidth label="Phone"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              sx={{ mb: 2 }} />
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Register as</InputLabel>
              <Select value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                label="Register as">
                <MenuItem value="buyer">Buyer</MenuItem>
                <MenuItem value="seller">Seller</MenuItem>
              </Select>
            </FormControl>
            <Button fullWidth variant="contained" type="submit"
              size="large" disabled={loading} sx={{ mb: 2, py: 1.5 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
            <Typography textAlign="center">
              Already have account?{' '}
              <Link to="/" style={{ color: '#1976d2' }}>Login</Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}