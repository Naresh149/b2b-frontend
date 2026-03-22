import { Box, Container, Typography, Button, Grid } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useNavigate } from 'react-router-dom'

const banners = [
  {
    title: 'Wholesale Electronics',
    subtitle: 'Buy in bulk & save up to 40%',
    desc: 'Latest laptops, phones, and gadgets at wholesale prices for businesses',
    bg: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #42a5f5 100%)',
    img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
    color: '#fff'
  },
  {
    title: 'Office Furniture',
    subtitle: 'Furnish your entire office',
    desc: 'Premium ergonomic chairs, desks and storage solutions for modern offices',
    bg: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #66bb6a 100%)',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    color: '#fff'
  },
  {
    title: 'Industrial Machinery',
    subtitle: 'Power your production line',
    desc: 'Heavy duty industrial machines for manufacturing and production units',
    bg: 'linear-gradient(135deg, #b71c1c 0%, #c62828 50%, #ef5350 100%)',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
    color: '#fff'
  }
]

export default function HeroBanner() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)

  return (
    <Box sx={{ mb: 4 }}>
      {/* Main Hero */}
      <Box sx={{
        background: banners[current].bg,
        borderRadius: 3, overflow: 'hidden',
        minHeight: 380, position: 'relative'
      }}>
        <Container maxWidth="xl">
          <Grid container alignItems="center" sx={{ minHeight: 380 }}>
            <Grid item xs={12} md={6} sx={{ py: 6, zIndex: 1 }}>
              <Typography variant="overline"
                sx={{ color: 'rgba(255,255,255,0.8)', letterSpacing: 3, fontWeight: 'bold' }}>
                B2B Wholesale
              </Typography>
              <Typography variant="h3" fontWeight="bold"
                sx={{ color: '#fff', mt: 1, mb: 2, lineHeight: 1.2 }}>
                {banners[current].title}
              </Typography>
              <Typography variant="h6"
                sx={{ color: 'rgba(255,255,255,0.9)', mb: 1, fontWeight: 400 }}>
                {banners[current].subtitle}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.75)', mb: 4, maxWidth: 400 }}>
                {banners[current].desc}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/home')}
                  sx={{
                    background: '#fff', color: '#1976d2',
                    fontWeight: 'bold', borderRadius: 2, px: 3,
                    '&:hover': { background: '#f5f5f5' }
                  }}>
                  Shop Now
                </Button>
                <Button variant="outlined" size="large"
                  sx={{ borderColor: '#fff', color: '#fff', borderRadius: 2, px: 3 }}>
                  View Catalog
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'flex-end', alignItems: 'center', pr: 4
            }}>
              <Box
                component="img"
                src={banners[current].img}
                alt="banner"
                sx={{
                  width: '100%', maxWidth: 480, height: 300,
                  objectFit: 'cover', borderRadius: 3,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}
              />
            </Grid>
          </Grid>
        </Container>

        {/* Dots */}
        <Box sx={{
          position: 'absolute', bottom: 20, left: '50%',
          transform: 'translateX(-50%)', display: 'flex', gap: 1
        }}>
          {banners.map((_, i) => (
            <Box key={i} onClick={() => setCurrent(i)} sx={{
              width: i === current ? 24 : 8, height: 8,
              borderRadius: 4, background: i === current ? '#fff' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer', transition: '0.3s'
            }} />
          ))}
        </Box>
      </Box>

      {/* Stats row */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {[
          { label: 'Products', value: '10,000+', icon: '📦' },
          { label: 'Sellers', value: '500+', icon: '🏪' },
          { label: 'Orders Delivered', value: '50,000+', icon: '🚚' },
          { label: 'Happy Buyers', value: '5,000+', icon: '⭐' }
        ].map((stat, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Box sx={{
              background: '#fff', borderRadius: 2,
              p: 2.5, textAlign: 'center',
              border: '1px solid #e0e0e0',
              '&:hover': { boxShadow: 4, transform: 'translateY(-2px)', transition: '0.3s' }
            }}>
              <Typography fontSize={28}>{stat.icon}</Typography>
              <Typography variant="h5" fontWeight="bold" color="primary">{stat.value}</Typography>
              <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

// Add this import at top!
import { useState } from 'react'