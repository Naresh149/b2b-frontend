import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box, Card, CardContent, TextField,
  Button, Typography, Alert, CircularProgress
} from '@mui/material'
import { setUser } from '../redux/authSlice'
import API from '../utils/api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await API.post('/auth/login', form)
      dispatch(setUser({ user: res.data.user, token: res.data.token }))
      const role = res.data.user.role
      if (role === 'admin') navigate('/admin')
      else if (role === 'seller') navigate('/seller')
      else navigate('/home')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1976d2, #42a5f5)'
    }}>
      <Card sx={{ width: 420, borderRadius: 3, boxShadow: 10 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={1}>
            🛒 B2B Shop
          </Typography>
          <Typography color="text.secondary" textAlign="center" mb={3}>
            Login to your account
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Email" type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              sx={{ mb: 2 }} required
            />
            <TextField
              fullWidth label="Password" type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              sx={{ mb: 3 }} required
            />
            <Button
              fullWidth variant="contained" type="submit"
              size="large" disabled={loading}
              sx={{ mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
            <Typography textAlign="center">
              Don't have account?{' '}
              <Link to="/register" style={{ color: '#1976d2' }}>Register</Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}