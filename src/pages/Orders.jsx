import { useState, useEffect } from 'react'
import {
  Box, Container, Typography, Paper, Chip,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, CircularProgress
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import API from '../utils/api'
import { useNavigate } from 'react-router-dom'

const statusColors = {
  pending: 'warning',
  confirmed: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error'
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    API.get('/orders/my')
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          📦 My Orders
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : orders.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h5" color="text.secondary">No orders yet!</Typography>
            <Button variant="contained" sx={{ mt: 2 }}
              onClick={() => navigate('/home')}>
              Start Shopping
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead sx={{ background: '#1976d2' }}>
                <TableRow>
                  {['Order ID', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map(h => (
                    <TableCell key={h} sx={{ color: 'white', fontWeight: 'bold' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography fontWeight="bold" color="primary">#{order.id}</Typography>
                    </TableCell>
                    <TableCell>{order.item_count} items</TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">
                        ₹{Number(order.total).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.payment_method.toUpperCase()}
                        size="small" variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status.toUpperCase()}
                        color={statusColors[order.status] || 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <Button size="small" startIcon={<VisibilityIcon />}
                        onClick={() => navigate(`/orders/${order.id}`)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
      <Footer />
    </Box>
  )
}