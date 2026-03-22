import { useState, useEffect } from 'react'
import {
  Box, Container, Grid, Typography, Paper,
  Card, CardContent, Avatar, Button,
  TextField, Divider, CircularProgress, Chip
} from '@mui/material'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PersonIcon from '@mui/icons-material/Person'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import API from '../../utils/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const statusColors = {
  pending: 'warning', confirmed: 'info',
  shipped: 'primary', delivered: 'success', cancelled: 'error'
}

export default function BuyerDashboard() {
  const [orders, setOrders] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', company_name: '', phone: '' })
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [ordersRes, profileRes] = await Promise.all([
        API.get('/orders/my'),
        API.get('/auth/profile')
      ])
      setOrders(ordersRes.data)
      setProfile(profileRes.data)
      setForm({
        name: profileRes.data.name,
        company_name: profileRes.data.company_name || '',
        phone: profileRes.data.phone || ''
      })
    } catch (err) {
      toast.error('Failed to load!')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async () => {
    try {
      await API.put('/auth/profile', form)
      toast.success('Profile updated!')
      setEditing(false)
      fetchAll()
    } catch (err) {
      toast.error('Failed to update!')
    }
  }

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0)
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length
  const activeOrders = orders.filter(o =>
    ['pending', 'confirmed', 'shipped'].includes(o.status)).length

  if (loading) return (
    <Box><Navbar />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={60} />
      </Box>
    </Box>
  )

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={4}>
          🛒 My Dashboard
        </Typography>

        <Grid container spacing={3}>
          {/* Left — Profile */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar sx={{
                  width: 80, height: 80, bgcolor: '#1976d2',
                  fontSize: 32, mx: 'auto', mb: 2
                }}>
                  {profile?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" fontWeight="bold">{profile?.name}</Typography>
                <Typography variant="body2" color="text.secondary">{profile?.email}</Typography>
                <Chip label="Buyer" color="primary" size="small" sx={{ mt: 1 }} />
              </Box>

              <Divider sx={{ mb: 2 }} />

              {editing ? (
                <Box>
                  <TextField fullWidth label="Full Name" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    sx={{ mb: 2 }} size="small" />
                  <TextField fullWidth label="Company" value={form.company_name}
                    onChange={e => setForm({ ...form, company_name: e.target.value })}
                    sx={{ mb: 2 }} size="small" />
                  <TextField fullWidth label="Phone" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    sx={{ mb: 2 }} size="small" />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button fullWidth variant="contained" onClick={updateProfile}
                      sx={{ borderRadius: 2 }}>Save</Button>
                    <Button fullWidth variant="outlined" onClick={() => setEditing(false)}
                      sx={{ borderRadius: 2 }}>Cancel</Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  {[
                    { label: 'Company', value: profile?.company_name || '—' },
                    { label: 'Phone', value: profile?.phone || '—' },
                    { label: 'Member since', value: new Date(profile?.created_at).toLocaleDateString('en-IN') }
                  ].map(item => (
                    <Box key={item.label} sx={{ mb: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                      <Typography variant="body2" fontWeight="bold">{item.value}</Typography>
                    </Box>
                  ))}
                  <Button fullWidth variant="outlined" startIcon={<PersonIcon />}
                    onClick={() => setEditing(true)} sx={{ mt: 1, borderRadius: 2 }}>
                    Edit Profile
                  </Button>
                </Box>
              )}
            </Paper>

            {/* Stats */}
            {[
              { label: 'Total Orders', value: orders.length, icon: <ShoppingBagIcon />, color: '#1976d2' },
              { label: 'Active Orders', value: activeOrders, icon: <LocalShippingIcon />, color: '#ed6c02' },
              { label: 'Delivered', value: deliveredOrders, icon: <CheckCircleIcon />, color: '#2e7d32' },
            ].map(stat => (
              <Card key={stat.label} sx={{ borderRadius: 3, mb: 2, border: '1px solid #f0f0f0' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      width: 44, height: 44, borderRadius: 2,
                      background: `${stat.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: stat.color
                    }}>
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                      <Typography variant="h5" fontWeight="bold" color={stat.color}>
                        {stat.value}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}

            <Card sx={{ borderRadius: 3, border: '1px solid #f0f0f0', background: '#e3f2fd' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">Total Spent</Typography>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  ₹{totalSpent.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Right — Orders */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{
                p: 3, display: 'flex',
                justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <Typography variant="h6" fontWeight="bold">📦 My Orders</Typography>
                <Button variant="outlined" size="small"
                  onClick={() => navigate('/home')} sx={{ borderRadius: 2 }}>
                  Shop More
                </Button>
              </Box>

              {orders.length === 0 ? (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <Typography fontSize={60}>🛒</Typography>
                  <Typography variant="h6" color="text.secondary" mt={1}>
                    No orders yet!
                  </Typography>
                  <Button variant="contained" sx={{ mt: 2, borderRadius: 2 }}
                    onClick={() => navigate('/home')}>
                    Start Shopping
                  </Button>
                </Box>
              ) : (
                orders.map((order, index) => (
                  <Box key={order.id}>
                    <Box sx={{ p: 3 }}>
                      <Box sx={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-start', mb: 1
                      }}>
                        <Box>
                          <Typography fontWeight="bold" color="primary">
                            Order #{order.id}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(order.created_at).toLocaleDateString('en-IN')} •{' '}
                            {order.item_count} items
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography fontWeight="bold">
                            ₹{Number(order.total).toLocaleString()}
                          </Typography>
                          <Chip
                            label={order.status.toUpperCase()}
                            color={statusColors[order.status]}
                            size="small" sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip
                          label={order.payment_method.toUpperCase()}
                          size="small" variant="outlined"
                        />
                        <Chip
                          label={order.payment_status.toUpperCase()}
                          size="small"
                          color={order.payment_status === 'paid' ? 'success' : 'warning'}
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    {index < orders.length - 1 && <Divider />}
                  </Box>
                ))
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  )
}