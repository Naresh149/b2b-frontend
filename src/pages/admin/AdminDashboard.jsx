import { useState, useEffect } from 'react'
import {
  Box, Container, Grid, Typography, Paper,
  Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead,
  TableRow, Chip, Select, MenuItem,
  CircularProgress, Avatar, Tabs, Tab,
  Button, IconButton
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import InventoryIcon from '@mui/icons-material/Inventory'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import StoreIcon from '@mui/icons-material/Store'
import PendingIcon from '@mui/icons-material/Pending'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import API from '../../utils/api'
import { toast } from 'react-toastify'

const statusColors = {
  pending: 'warning',
  confirmed: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error'
}

function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <Card sx={{
      borderRadius: 3, border: '1px solid #f0f0f0',
      transition: '0.3s',
      '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
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

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [monthlySales, setMonthlySales] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [statsRes, salesRes, ordersRes, usersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/monthly-sales'),
        API.get('/admin/orders'),
        API.get('/admin/users')
      ])
      setStats(statsRes.data)
      setMonthlySales(salesRes.data)
      setOrders(ordersRes.data)
      setUsers(usersRes.data)
    } catch (err) {
      toast.error('Failed to load dashboard!')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/admin/orders/${orderId}/status`, { status })
      toast.success('Order status updated!')
      fetchAll()
    } catch (err) {
      toast.error('Failed to update!')
    }
  }

  const toggleUser = async (userId) => {
    try {
      await API.put(`/admin/users/${userId}/toggle`)
      toast.success('User status updated!')
      fetchAll()
    } catch (err) {
      toast.error('Failed to update!')
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
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            👨‍💼 Admin Dashboard
          </Typography>
          <Typography color="text.secondary">
            Welcome back! Here's what's happening today.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
            <StatCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon={<PeopleIcon sx={{ color: '#1976d2' }} />}
              color="#1976d2"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
            <StatCard
              title="Total Orders"
              value={stats?.totalOrders || 0}
              icon={<ShoppingBagIcon sx={{ color: '#9c27b0' }} />}
              color="#9c27b0"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
            <StatCard
              title="Products"
              value={stats?.totalProducts || 0}
              icon={<InventoryIcon sx={{ color: '#2e7d32' }} />}
              color="#2e7d32"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
            <StatCard
              title="Revenue"
              value={`₹${Number(stats?.totalRevenue || 0).toLocaleString()}`}
              icon={<AttachMoneyIcon sx={{ color: '#ed6c02' }} />}
              color="#ed6c02"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
            <StatCard
              title="Sellers"
              value={stats?.totalSellers || 0}
              icon={<StoreIcon sx={{ color: '#0288d1' }} />}
              color="#0288d1"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
            <StatCard
              title="Pending Orders"
              value={stats?.pendingOrders || 0}
              icon={<PendingIcon sx={{ color: '#d32f2f' }} />}
              color="#d32f2f"
            />
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                📈 Monthly Revenue
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(val) => `₹${Number(val).toLocaleString()}`} />
                  <Area
                    type="monotone" dataKey="revenue"
                    stroke="#1976d2" fill="#e3f2fd"
                    name="Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                📊 Monthly Orders
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#9c27b0" name="Orders" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)}
            sx={{ borderBottom: '1px solid #f0f0f0', px: 2 }}>
            <Tab label="📦 All Orders" />
            <Tab label="👥 All Users" />
          </Tabs>

          {/* Orders Tab */}
          {tab === 0 && (
            <Box sx={{ p: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ background: '#f5f5f5' }}>
                    <TableRow>
                      {['Order ID', 'Buyer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Update'].map(h => (
                        <TableCell key={h} sx={{ fontWeight: 'bold' }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map(order => (
                      <TableRow key={order.id} hover>
                        <TableCell>
                          <Typography fontWeight="bold" color="primary">#{order.id}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">{order.buyer_name}</Typography>
                            <Typography variant="caption" color="text.secondary">{order.email}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{order.item_count}</TableCell>
                        <TableCell>
                          <Typography fontWeight="bold">₹{Number(order.total).toLocaleString()}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={order.payment_method.toUpperCase()} size="small" variant="outlined" />
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
                          <Select
                            size="small" value={order.status}
                            onChange={e => updateOrderStatus(order.id, e.target.value)}
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
            </Box>
          )}

          {/* Users Tab */}
          {tab === 1 && (
            <Box sx={{ p: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ background: '#f5f5f5' }}>
                    <TableRow>
                      {['User', 'Email', 'Role', 'Company', 'Status', 'Joined', 'Action'].map(h => (
                        <TableCell key={h} sx={{ fontWeight: 'bold' }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 36, height: 36, bgcolor: '#1976d2', fontSize: 14 }}>
                              {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography fontWeight="bold">{user.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role.toUpperCase()}
                            size="small"
                            color={
                              user.role === 'admin' ? 'error' :
                                user.role === 'seller' ? 'primary' : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell>{user.company_name || '—'}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.is_active ? 'Active' : 'Blocked'}
                            color={user.is_active ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color={user.is_active ? 'error' : 'success'}
                            onClick={() => toggleUser(user.id)}
                            title={user.is_active ? 'Block User' : 'Activate User'}
                          >
                            {user.is_active
                              ? <BlockIcon fontSize="small" />
                              : <CheckCircleIcon fontSize="small" />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      </Container>
      <Footer />
    </Box>
  )
}