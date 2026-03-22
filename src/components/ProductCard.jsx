import {
  Card, CardMedia, CardContent, CardActions,
  Typography, Button, Chip, Rating, Box, IconButton
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PLACEHOLDER_IMAGES = {
  'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
  'Furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
  'Clothing': 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80',
  'Food': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80',
  'Machinery': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80',
}

export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)

  const imgSrc = product.image
    ? `http://localhost:5000${product.image}`
    : PLACEHOLDER_IMAGES[product.category_name] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80'

  return (
    <Card sx={{
      height: '100%', display: 'flex', flexDirection: 'column',
      borderRadius: 3, border: '1px solid #f0f0f0',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 8px 32px rgba(25,118,210,0.15)',
        transform: 'translateY(-6px)',
        border: '1px solid #90caf9'
      }
    }}>
      {/* Image */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="220"
          image={imgSrc}
          alt={product.title}
          sx={{
            cursor: 'pointer', objectFit: 'cover',
            transition: '0.4s',
            '&:hover': { transform: 'scale(1.05)' }
          }}
          onClick={() => navigate(`/product/${product.id}`)}
        />
        {/* Overlay buttons */}
        <Box sx={{
          position: 'absolute', top: 8, right: 8,
          display: 'flex', flexDirection: 'column', gap: 0.5
        }}>
          <IconButton size="small" sx={{
            background: '#fff', boxShadow: 2,
            '&:hover': { background: '#ffebee', color: 'error.main' }
          }}>
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>
          <IconButton size="small"
            onClick={() => navigate(`/product/${product.id}`)}
            sx={{ background: '#fff', boxShadow: 2 }}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Box>
        {/* Stock badge */}
        {product.stock === 0 && (
          <Box sx={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <Typography color="white" fontWeight="bold">OUT OF STOCK</Typography>
          </Box>
        )}
        {/* New badge */}
        {product.stock > 100 && (
          <Chip label="BULK DEAL" size="small" color="success"
            sx={{ position: 'absolute', top: 8, left: 8, fontWeight: 'bold', fontSize: 10 }} />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Chip
          label={product.category_name || 'General'}
          size="small"
          sx={{
            mb: 1, fontSize: 10, height: 20,
            background: '#e3f2fd', color: '#1565c0',
            fontWeight: 'bold'
          }}
        />
        <Typography
          variant="subtitle1" fontWeight="bold"
          sx={{
            cursor: 'pointer', mb: 0.5,
            overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', lineHeight: 1.3,
            '&:hover': { color: 'primary.main' }
          }}
          onClick={() => navigate(`/product/${product.id}`)}>
          {product.title}
        </Typography>

        <Typography variant="caption" color="text.secondary"
          sx={{
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 1
          }}>
          {product.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <Rating value={Number(product.avg_rating) || 0} readOnly size="small" precision={0.5} />
          <Typography variant="caption" color="text.secondary">
            ({product.review_count || 0})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            ₹{Number(product.price).toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary"
            sx={{ textDecoration: 'line-through' }}>
            ₹{(Number(product.price) * 1.2).toLocaleString()}
          </Typography>
          <Typography variant="caption" color="success.main" fontWeight="bold">
            20% off
          </Typography>
        </Box>

        <Typography variant="caption"
          color={product.stock > 0 ? 'success.main' : 'error.main'}
          fontWeight="bold">
          {product.stock > 0 ? `✓ ${product.stock} units available` : '✗ Out of stock'}
        </Typography>
      </CardContent>

      {user?.role === 'buyer' && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            fullWidth variant="contained" size="medium"
            startIcon={<ShoppingCartIcon />}
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            sx={{
              borderRadius: 2, textTransform: 'none',
              fontWeight: 'bold', py: 1,
              background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
              '&:hover': { background: 'linear-gradient(135deg, #1565c0, #1976d2)' }
            }}>
            Add to Cart
          </Button>
        </CardActions>
      )}
    </Card>
  )
}