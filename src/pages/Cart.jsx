import { useState, useEffect } from 'react'
import {
  Box, Container, Grid, Typography, Button,
  Paper, IconButton, Divider, CircularProgress,
  Card, CardMedia
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteIcon from '@mui/icons-material/Delete'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import API from '../utils/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCart, clearCart } from '../redux/cartSlice'

const PLACEHOLDER_IMAGES = {
  'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&q=80',
  'Furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80',
  'Clothing': 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&q=80',
  'Food': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&q=80',
  'Machinery': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&q=80',
}

export default function Cart() {
  const [cartData, setCartData] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart')
      setCartData(res.data)
      dispatch(setCart(res.data))
    } catch (err) {
      toast.error('Failed to load cart!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCart() }, [])

  const updateQuantity = async (id, qty) => {
    if (qty < 1) return
    try {
      await API.put(`/cart/${id}`, { quantity: qty })
      fetchCart()
    } catch (err) {
      toast.error('Failed to update!')
    }
  }

  const removeItem = async (id) => {
    try {
      await API.delete(`/cart/${id}`)
      toast.success('Item removed!')
      fetchCart()
    } catch (err) {
      toast.error('Failed to remove!')
    }
  }

  const handleClearCart = async () => {
    if (!window.confirm('Clear entire cart?')) return
    try {
      await API.delete('/cart')
      dispatch(clearCart())
      setCartData({ items: [], total: 0 })
      toast.success('Cart cleared!')
    } catch (err) {
      toast.error('Failed to clear cart!')
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          🛒 My Cart ({cartData.items.length} items)
        </Typography>

        {cartData.items.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
            <ShoppingCartIcon sx={{ fontSize: 80, color: '#e0e0e0' }} />
            <Typography variant="h5" fontWeight="bold" mt={2} color="text.secondary">
              Your cart is empty!
            </Typography>
            <Typography color="text.secondary" mt={1} mb={3}>
              Add some products to your cart
            </Typography>
            <Button variant="contained" size="large"
              onClick={() => navigate('/home')}
              sx={{ borderRadius: 2, px: 4 }}>
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {/* Cart items */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', p: 2, background: '#f5f5f5'
                }}>
                  <Typography fontWeight="bold">Cart Items</Typography>
                  <Button size="small" color="error" onClick={handleClearCart}>
                    Clear All
                  </Button>
                </Box>

                {cartData.items.map((item, index) => (
                  <Box key={item.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 2 }}>
                      {/* Image */}
                      <Box
                        component="img"
                        src={item.image
                          ? `http://localhost:5000${item.image}`
                          : PLACEHOLDER_IMAGES[item.category_name] || 'https://via.placeholder.com/100'}
                        sx={{ width: 90, height: 90, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
                      />

                      {/* Details */}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography fontWeight="bold" mb={0.5}>{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          Unit Price: ₹{Number(item.price).toLocaleString()}
                        </Typography>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </Typography>
                      </Box>

                      {/* Quantity controls */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="small"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography fontWeight="bold" sx={{ minWidth: 30, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton size="small"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Remove */}
                      <IconButton color="error" onClick={() => removeItem(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    {index < cartData.items.length - 1 && <Divider />}
                  </Box>
                ))}
              </Paper>
            </Grid>

            {/* Order summary */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ borderRadius: 3, p: 3, position: 'sticky', top: 100 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Order Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {cartData.items.map(item => (
                  <Box key={item.id} sx={{
                    display: 'flex', justifyContent: 'space-between', mb: 1
                  }}>
                    <Typography variant="body2" color="text.secondary" noWrap
                      sx={{ maxWidth: 180 }}>
                      {item.title} x{item.quantity}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </Typography>
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography fontWeight="bold">₹{Number(cartData.total).toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography color="success.main" fontWeight="bold">
                    {cartData.total > 10000 ? 'FREE' : '₹500'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">GST (18%)</Typography>
                  <Typography fontWeight="bold">
                    ₹{Math.round(cartData.total * 0.18).toLocaleString()}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">Total</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ₹{(
                      Number(cartData.total) +
                      Math.round(cartData.total * 0.18) +
                      (cartData.total > 10000 ? 0 : 500)
                    ).toLocaleString()}
                  </Typography>
                </Box>

                <Button fullWidth variant="contained" size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/checkout')}
                  sx={{
                    borderRadius: 2, py: 1.5,
                    fontWeight: 'bold', textTransform: 'none',
                    background: 'linear-gradient(135deg, #1976d2, #42a5f5)'
                  }}>
                  Proceed to Checkout
                </Button>

                <Button fullWidth variant="text" sx={{ mt: 1 }}
                  onClick={() => navigate('/home')}>
                  ← Continue Shopping
                </Button>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
      <Footer />
    </Box>
  )
}