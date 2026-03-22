import { useState, useEffect } from 'react'
import {
  Box, Container, Grid, Typography, Button,
  Chip, Rating, Divider, CircularProgress,
  Paper, TextField, Avatar, Alert
} from '@mui/material'
import API from '../utils/api'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import Navbar from '../components/Navbar'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    fetchProduct()
    fetchReviews()
  }, [id])

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`)
      setProduct(res.data)
    } catch (err) {
      toast.error('Product not found!')
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/${id}`)
      setReviews(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddToCart = async () => {
    try {
      await API.post('/cart', { product_id: product.id, quantity: 1 })
      toast.success('Added to cart!')
    } catch (err) {
      toast.error('Failed to add to cart!')
    }
  }

  const submitReview = async () => {
    if (!reviewForm.rating) return toast.error('Please select a rating!')
    setSubmitting(true)
    try {
      await API.post(`/reviews/${id}`, reviewForm)
      toast.success('Review added!')
      setReviewForm({ rating: 0, comment: '' })
      fetchReviews()
      fetchProduct()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed!')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <Box><Navbar />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress size={60} />
      </Box>
    </Box>
  )

  if (!product) return null

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Back
        </Button>

        <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box component="img"
                src={product.image
                  ? `http://localhost:5000${product.image}`
                  : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&q=80'}
                alt={product.title}
                sx={{ width: '100%', borderRadius: 2, objectFit: 'cover', maxHeight: 400 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip label={product.category_name} color="primary" variant="outlined" sx={{ mb: 2 }} />
              <Typography variant="h4" fontWeight="bold" mb={1}>{product.title}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Rating value={Number(product.avg_rating) || 0} readOnly precision={0.5} />
                <Typography color="text.secondary">
                  ({product.review_count || 0} reviews)
                </Typography>
              </Box>
              <Typography variant="h4" color="primary" fontWeight="bold" mb={2}>
                ₹{Number(product.price).toLocaleString()}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" color="text.secondary" mb={3}>
                {product.description}
              </Typography>
              <Typography variant="body2" mb={1}>
                <strong>Seller:</strong> {product.seller_name} — {product.company_name}
              </Typography>
              <Typography variant="body2" mb={3}
                color={product.stock > 0 ? 'success.main' : 'error'}>
                <strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </Typography>
              {user?.role === 'buyer' && (
                <Button variant="contained" size="large"
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  sx={{ px: 4, py: 1.5, borderRadius: 2 }}>
                  Add to Cart
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>

        {/* Reviews Section */}
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            ⭐ Reviews ({reviews.length})
          </Typography>

          {/* Add Review Form */}
          {user?.role === 'buyer' && (
            <Box sx={{ mb: 3, p: 2, background: '#f5f5f5', borderRadius: 2 }}>
              <Typography fontWeight="bold" mb={1}>Write a Review</Typography>
              <Rating
                value={reviewForm.rating}
                onChange={(e, val) => setReviewForm({ ...reviewForm, rating: val })}
                size="large" sx={{ mb: 2 }}
              />
              <TextField
                fullWidth multiline rows={3}
                placeholder="Share your experience with this product..."
                value={reviewForm.comment}
                onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" onClick={submitReview}
                disabled={submitting || !reviewForm.rating}
                sx={{ borderRadius: 2 }}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </Box>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={3}>
              No reviews yet. Be the first to review!
            </Typography>
          ) : (
            reviews.map((review, index) => (
              <Box key={review.id}>
                <Box sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Avatar sx={{ bgcolor: '#1976d2', width: 36, height: 36 }}>
                      {review.user_name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography fontWeight="bold">{review.user_name}</Typography>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                      {new Date(review.created_at).toLocaleDateString('en-IN')}
                    </Typography>
                  </Box>
                  {review.comment && (
                    <Typography variant="body2" color="text.secondary" ml={6.5}>
                      {review.comment}
                    </Typography>
                  )}
                </Box>
                {index < reviews.length - 1 && <Divider />}
              </Box>
            ))
          )}
        </Paper>
      </Container>
    </Box>
  )
}