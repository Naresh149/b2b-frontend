import {
  Card, CardContent, CardActions,
  Typography, Button, Chip, Rating,
  Box, IconButton
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const CATEGORY_COLORS = {
  'Electronics': { bg: '#e3f2fd', color: '#1565c0', text: 'Electronics' },
  'Furniture': { bg: '#e8f5e9', color: '#2e7d32', text: 'Furniture' },
  'Clothing': { bg: '#f3e5f5', color: '#7b1fa2', text: 'Clothing' },
  'Food': { bg: '#fff3e0', color: '#e65100', text: 'Food' },
  'Machinery': { bg: '#eceff1', color: '#37474f', text: 'Machinery' },
}

const CATEGORY_EMOJIS = {
  'Electronics': '💻',
  'Furniture': '🪑',
  'Clothing': '👔',
  'Food': '🍱',
  'Machinery': '⚙️',
}

export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)

  const categoryStyle = CATEGORY_COLORS[product.category_name] || {
    bg: '#f5f5f5', color: '#424242', text: product.category_name
  }
  const emoji = CATEGORY_EMOJIS[product.category_name] || '📦'

  const hasImage = product.image &&
    !product.image.includes('unsplash') &&
    product.image.startsWith('http')

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
      {/* Image / Category Banner */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {hasImage ? (
          <Box
            component="img"
            src={product.image.startsWith('/uploads')
              ? `https://b2b-backend-b6l6.onrender.com${product.image}`
              : product.image}
            alt={product.title}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
            sx={{
              width: '100%', height: 200,
              objectFit: 'cover', cursor: 'pointer',
              transition: '0.4s',
              '&:hover': { transform: 'scale(1.05)' }
            }}
            onClick={() => navigate(`/product/${product.id}`)}
          />
        ) : null}

        {/* Category Color Banner — shows when no image */}
        <Box sx={{
          display: hasImage ? 'none' : 'flex',
          height: 200, cursor: 'pointer',
          background: `linear-gradient(135deg, ${categoryStyle.bg}, ${categoryStyle.color}22)`,
          alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 1
        }}
          onClick={() => navigate(`/product/${product.id}`)}>
          <Typography fontSize={60}>{emoji}</Typography>
          <Typography fontWeight="bold" color={categoryStyle.color} fontSize={14}>
            {product.category_name}
          </Typography>
        </Box>

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

        {/* Bulk deal badge */}
        {product.stock > 100 && (
          <Chip label="BULK DEAL" size="small" color="success"
            sx={{
              position: 'absolute', top: 8, left: 8,
              fontWeight: 'bold', fontSize: 10
            }} />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Chip
          label={product.category_name || 'General'}
          size="small"
          sx={{
            mb: 1, fontSize: 10, height: 20,
            background: categoryStyle.bg,
            color: categoryStyle.color,
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
          <Rating value={Number(product.avg_rating) || 0}
            readOnly size="small" precision={0.5} />
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

      {/* Show View button when not logged in */}
      {!user && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            fullWidth variant="outlined" size="medium"
            startIcon={<VisibilityIcon />}
            onClick={() => navigate(`/product/${product.id}`)}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}>
            View Details
          </Button>
        </CardActions>
      )}
    </Card>
  )
}