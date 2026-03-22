import { useState, useEffect } from 'react'
import {
  Box, Container, Grid, Typography, Button,
  Paper, TextField, Divider, Radio, RadioGroup,
  FormControlLabel, FormControl, FormLabel,
  Stepper, Step, StepLabel, CircularProgress, Alert
} from '@mui/material'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PaymentIcon from '@mui/icons-material/Payment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Navbar from '../components/Navbar'
import API from '../utils/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearCart } from '../redux/cartSlice'

const steps = ['Delivery Address', 'Payment Method', 'Confirm Order']

export default function Checkout() {
  const [activeStep, setActiveStep] = useState(0)
  const [cartData, setCartData] = useState({ items: [], total: 0 })
  const [address, setAddress] = useState({
    name: '', phone: '', street: '',
    city: '', state: '', pincode: '', company: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    API.get('/cart').then(res => setCartData(res.data))
  }, [])

  const grandTotal = Number(cartData.total) +
    Math.round(cartData.total * 0.18) +
    (cartData.total > 10000 ? 0 : 500)

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      const addressStr = `${address.name}, ${address.company}, ${address.street}, ${address.city}, ${address.state} - ${address.pincode}, Phone: ${address.phone}`

      if (paymentMethod === 'razorpay') {
        // Razorpay flow
        const rzpRes = await API.post('/payments/razorpay/create', { amount: grandTotal })
        const options = {
          key: rzpRes.data.key,
          amount: rzpRes.data.amount,
          currency: rzpRes.data.currency,
          name: 'B2B Shop',
          description: 'Order Payment',
          order_id: rzpRes.data.order_id,
          handler: async (response) => {
            const orderRes = await API.post('/orders', {
              address: addressStr,
              payment_method: 'razorpay'
            })
            await API.post('/payments/razorpay/verify', {
              ...response,
              order_id: orderRes.data.order_id
            })
            dispatch(clearCart())
            setOrderId(orderRes.data.order_id)
            setActiveStep(3)
            toast.success('Payment successful!')
          },
          theme: { color: '#1976d2' }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        // COD or Stripe
        const res = await API.post('/orders', {
          address: addressStr,
          payment_method: paymentMethod
        })
        dispatch(clearCart())
        setOrderId(res.data.order_id)
        setActiveStep(3)
        toast.success('Order placed successfully!')
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Order failed!')
    } finally {
      setLoading(false)
    }
  }

  // Order Success Screen
  if (activeStep === 3) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <Navbar />
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Paper sx={{ p: 6, borderRadius: 3, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main' }} />
            <Typography variant="h4" fontWeight="bold" mt={2} color="success.main">
              Order Placed!
            </Typography>
            <Typography color="text.secondary" mt={1} mb={1}>
              Your order has been placed successfully
            </Typography>
            <Typography variant="h6" color="primary" fontWeight="bold" mb={3}>
              Order ID: #{orderId}
            </Typography>
            <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
              {paymentMethod === 'cod'
                ? '💵 Cash on Delivery selected. Pay when you receive!'
                : '✅ Payment received successfully!'}
            </Alert>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button fullWidth variant="outlined" borderRadius={2}
                onClick={() => navigate('/orders')}>
                View Orders
              </Button>
              <Button fullWidth variant="contained"
                onClick={() => navigate('/home')}
                sx={{ borderRadius: 2 }}>
                Continue Shopping
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>Checkout</Typography>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={3}>
          {/* Left side */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>

              {/* Step 1 — Address */}
              {activeStep === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <LocalShippingIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">Delivery Address</Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Full Name *"
                        value={address.name}
                        onChange={e => setAddress({ ...address, name: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Phone *"
                        value={address.phone}
                        onChange={e => setAddress({ ...address, phone: e.target.value })} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Company Name"
                        value={address.company}
                        onChange={e => setAddress({ ...address, company: e.target.value })} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Street Address *"
                        value={address.street}
                        onChange={e => setAddress({ ...address, street: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField fullWidth label="City *"
                        value={address.city}
                        onChange={e => setAddress({ ...address, city: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField fullWidth label="State *"
                        value={address.state}
                        onChange={e => setAddress({ ...address, state: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField fullWidth label="Pincode *"
                        value={address.pincode}
                        onChange={e => setAddress({ ...address, pincode: e.target.value })} />
                    </Grid>
                  </Grid>
                  <Button fullWidth variant="contained" size="large"
                    sx={{ mt: 3, borderRadius: 2, py: 1.5 }}
                    onClick={() => {
                      if (!address.name || !address.phone || !address.street ||
                        !address.city || !address.state || !address.pincode) {
                        return toast.error('Please fill all required fields!')
                      }
                      setActiveStep(1)
                    }}>
                    Continue to Payment
                  </Button>
                </Box>
              )}

              {/* Step 2 — Payment */}
              {activeStep === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <PaymentIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">Payment Method</Typography>
                  </Box>
                  <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <RadioGroup value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value)}>

                      {/* COD */}
                      <Paper variant="outlined" sx={{
                        p: 2, mb: 2, borderRadius: 2,
                        border: paymentMethod === 'cod' ? '2px solid #1976d2' : '1px solid #e0e0e0'
                      }}>
                        <FormControlLabel value="cod" control={<Radio />}
                          label={
                            <Box>
                              <Typography fontWeight="bold">💵 Cash on Delivery</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Pay when you receive your order
                              </Typography>
                            </Box>
                          } />
                      </Paper>

                      {/* Razorpay */}
                      <Paper variant="outlined" sx={{
                        p: 2, mb: 2, borderRadius: 2,
                        border: paymentMethod === 'razorpay' ? '2px solid #1976d2' : '1px solid #e0e0e0'
                      }}>
                        <FormControlLabel value="razorpay" control={<Radio />}
                          label={
                            <Box>
                              <Typography fontWeight="bold">💳 Razorpay</Typography>
                              <Typography variant="caption" color="text.secondary">
                                UPI, Cards, Net Banking, Wallets
                              </Typography>
                            </Box>
                          } />
                      </Paper>

                      {/* Stripe */}
                      <Paper variant="outlined" sx={{
                        p: 2, mb: 2, borderRadius: 2,
                        border: paymentMethod === 'stripe' ? '2px solid #1976d2' : '1px solid #e0e0e0'
                      }}>
                        <FormControlLabel value="stripe" control={<Radio />}
                          label={
                            <Box>
                              <Typography fontWeight="bold">🌍 Stripe</Typography>
                              <Typography variant="caption" color="text.secondary">
                                International Cards — Visa, Mastercard
                              </Typography>
                            </Box>
                          } />
                      </Paper>
                    </RadioGroup>
                  </FormControl>

                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button variant="outlined" onClick={() => setActiveStep(0)}
                      sx={{ borderRadius: 2 }}>
                      Back
                    </Button>
                    <Button fullWidth variant="contained" size="large"
                      onClick={() => setActiveStep(2)}
                      sx={{ borderRadius: 2, py: 1.5 }}>
                      Review Order
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Step 3 — Confirm */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    Review Your Order
                  </Typography>

                  {/* Address summary */}
                  <Box sx={{ p: 2, background: '#f5f5f5', borderRadius: 2, mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold" mb={0.5}>
                      📍 Delivery Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {address.name}, {address.company && `${address.company},`}{' '}
                      {address.street}, {address.city}, {address.state} - {address.pincode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📞 {address.phone}
                    </Typography>
                  </Box>

                  {/* Payment summary */}
                  <Box sx={{ p: 2, background: '#f5f5f5', borderRadius: 2, mb: 3 }}>
                    <Typography variant="body2" fontWeight="bold" mb={0.5}>
                      💳 Payment Method
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {paymentMethod === 'cod' ? '💵 Cash on Delivery'
                        : paymentMethod === 'razorpay' ? '💳 Razorpay'
                          : '🌍 Stripe'}
                    </Typography>
                  </Box>

                  {/* Items */}
                  {cartData.items.map(item => (
                    <Box key={item.id} sx={{
                      display: 'flex', justifyContent: 'space-between', mb: 1
                    }}>
                      <Typography variant="body2">{item.title} x{item.quantity}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}

                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button variant="outlined" onClick={() => setActiveStep(1)}
                      sx={{ borderRadius: 2 }}>
                      Back
                    </Button>
                    <Button fullWidth variant="contained" size="large"
                      onClick={handlePlaceOrder} disabled={loading}
                      sx={{
                        borderRadius: 2, py: 1.5, fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #1976d2, #42a5f5)'
                      }}>
                      {loading ? <CircularProgress size={24} color="inherit" />
                        : `Place Order — ₹${grandTotal.toLocaleString()}`}
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right — Order summary */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Order Summary</Typography>
              <Divider sx={{ mb: 2 }} />
              {cartData.items.map(item => (
                <Box key={item.id} sx={{
                  display: 'flex', justifyContent: 'space-between', mb: 1
                }}>
                  <Typography variant="body2" color="text.secondary" noWrap
                    sx={{ maxWidth: 160 }}>
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="bold">Total</Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  ₹{grandTotal.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}