import { useState, useEffect } from 'react'
import {
  Box, Container, Grid, Typography, Paper,
  Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead,
  TableRow, Chip, Select, MenuItem,
  CircularProgress, Button, Tabs, Tab
} from '@mui/material'
import InventoryIcon from '@mui/icons-material/Inventory'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddIcon from '@mui/icons-material/Add'
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import API from '../../utils/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const statusColors = {
  pending: 'warning', confirmed: 'info',
  shipped: 'primary', delivered: 'success', cancelled: 'error'
}

function StatCard({ title, value, icon, color }) {
  return (
    <Card sx={{ borderRadius: 3, border: '1px solid #f0f0f0' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" mb={0.5}>{title}</Typography>
            <Typography variant="h4" fontWeight="bold" color={color}>{value}</Typography>
          </Box>
          <Box sx={{
            width: 52, height: 52, borderRadius: 2,
            background: `${color}15`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function SellerDashboard() {
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)
  const navigate = useNavigate()

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        API.get('/admin/seller/stats'),
        API.get('/admin/seller/orders')
      ])
      setStats(statsRes.data)
      setOrders(ordersRes.data)
    } catch (err) {
      toast.error('Failed to load dashboard!')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/admin/orders/${orderId}/status`, { status })
      toast.success('Order updated!')
      fetchAll()
    } catch (err) {
      toast.error('Failed!')
    }
  }

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
      <Container maxWidth="xl" sx={{ py: 4 }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold">🏪 Seller Dashboard</Typography>
            <Typography color="text.secondary">Manage your products and orders</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />}
            onClick={() => navigate('/seller/products')}
            sx={{ borderRadius: 2 }}>
            Manage Products
          </Button>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="My Products" value={stats?.totalProducts || 0}
              icon={<InventoryIcon sx={{ color: '#1976d2' }} />} color="#1976d2" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Total Orders" value={stats?.totalOrders || 0}
              icon={<ShoppingBagIcon sx={{ color: '#9c27b0' }} />} color="#9c27b0" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Revenue" value={`₹${Number(stats?.totalRevenue || 0).toLocaleString()}`}
              icon={<AttachMoneyIcon sx={{ color: '#ed6c02' }} />} color="#ed6c02" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Active Products" value={stats?.activeProducts || 0}
              icon={<CheckCircleIcon sx={{ color: '#2e7d32' }} />} color="#2e7d32" />
          </Grid>
        </Grid>

        {/* Orders Table */}
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
            <Typography variant="h6" fontWeight="bold">📦 Recent Orders</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: '#f5f5f5' }}>
                <TableRow>
                  {['Order ID', 'Buyer', 'Company', 'Items', 'Total', 'Status', 'Date', 'Update'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 'bold' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">No orders yet!</Typography>
                    </TableCell>
                  </TableRow>
                ) : orders.map(order => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography fontWeight="bold" color="primary">#{order.id}</Typography>
                    </TableCell>
                    <TableCell>{order.buyer_name}</TableCell>
                    <TableCell>{order.company_name || '—'}</TableCell>
                    <TableCell>{order.item_count}</TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">
                        ₹{Number(order.total).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status.toUpperCase()}
                        color={statusColors[order.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <Select size="small" value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        sx={{ borderRadius: 2, minWidth: 130 }}>
                        {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
                          <MenuItem key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
      <Footer />
    </Box>
  )
}