import { useState, useEffect } from 'react'
import {
  Box, Container, Grid, Typography, CircularProgress,
  Chip, Drawer, Slider, Button, Divider,
  FormControl, InputLabel, Select, MenuItem, Badge
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import CloseIcon from '@mui/icons-material/Close'
import TuneIcon from '@mui/icons-material/Tune'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import HeroBanner from '../components/HeroBanner'
import Footer from '../components/Footer'
import API from '../utils/api'
import { toast } from 'react-toastify'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [sortBy, setSortBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  const activeFilters =
    (selectedCategory ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 100000 ? 1 : 0) +
    (sortBy ? 1 : 0)

  const fetchProducts = async (searchVal = search) => {
    setLoading(true)
    try {
      const res = await API.get('/products', {
        params: {
          search: searchVal,
          category_id: selectedCategory || undefined,
          min_price: priceRange[0],
          max_price: priceRange[1]
        }
      })
      let data = res.data
      if (sortBy === 'price_asc') data = [...data].sort((a, b) => a.price - b.price)
      if (sortBy === 'price_desc') data = [...data].sort((a, b) => b.price - a.price)
      if (sortBy === 'newest') data = [...data].sort((a, b) => b.id - a.id)
      setProducts(data)
    } catch (err) {
      toast.error('Failed to load products!')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories')
      setCategories(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { fetchCategories() }, [])
  useEffect(() => { fetchProducts() }, [search, selectedCategory, priceRange, sortBy])

  const handleAddToCart = async (product) => {
    try {
      await API.post('/cart', { product_id: product.id, quantity: 1 })
      toast.success(`✅ ${product.title} added to cart!`)
    } catch (err) {
      toast.error('Failed to add to cart!')
    }
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setPriceRange([0, 100000])
    setSortBy('')
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Navbar onSearch={(val) => { setSearch(val); fetchProducts(val) }} />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Hero Banner */}
        <HeroBanner />

        {/* Category bar + Filter button */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          mb: 3, flexWrap: 'wrap',
          background: '#fff', p: 2, borderRadius: 3,
          border: '1px solid #f0f0f0'
        }}>
          {/* Filter button */}
          <Badge badgeContent={activeFilters} color="error">
            <Button
              variant={activeFilters > 0 ? 'contained' : 'outlined'}
              startIcon={<TuneIcon />}
              onClick={() => setFilterOpen(true)}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold', mr: 1 }}
            >
              Filters
            </Button>
          </Badge>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Category chips */}
          <Chip
            label="All"
            onClick={() => setSelectedCategory('')}
            sx={{
              fontWeight: selectedCategory === '' ? 'bold' : 'normal',
              background: selectedCategory === '' ? '#1976d2' : '#f5f5f5',
              color: selectedCategory === '' ? '#fff' : '#424242',
              '&:hover': { background: selectedCategory === '' ? '#1565c0' : '#e3f2fd' },
              cursor: 'pointer'
            }}
          />
          {categories.map(cat => (
            <Chip
              key={cat.id}
              label={cat.name}
              onClick={() => setSelectedCategory(
                selectedCategory === cat.id ? '' : cat.id
              )}
              sx={{
                fontWeight: selectedCategory === cat.id ? 'bold' : 'normal',
                background: selectedCategory === cat.id ? '#1976d2' : '#f5f5f5',
                color: selectedCategory === cat.id ? '#fff' : '#424242',
                '&:hover': { background: '#e3f2fd', color: '#1976d2' },
                cursor: 'pointer'
              }}
            />
          ))}

          {/* Sort + count on right */}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {products.length} products
            </Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort by</InputLabel>
              <Select value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                label="Sort by"
                sx={{ borderRadius: 2 }}>
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                <MenuItem value="price_desc">Price: High to Low</MenuItem>
                <MenuItem value="newest">Newest First</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Products Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress size={60} />
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{
            textAlign: 'center', mt: 8, p: 6,
            background: '#fff', borderRadius: 3
          }}>
            <Typography fontSize={60}>😕</Typography>
            <Typography variant="h5" fontWeight="bold" mt={2}>
              No products found!
            </Typography>
            <Typography color="text.secondary" mt={1}>
              Try different search or category
            </Typography>
            <Button variant="contained" sx={{ mt: 3 }} onClick={clearFilters}>
              Clear Filters
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {products.map(product => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Footer />

      {/* Filter Drawer / Popup */}
      <Drawer
        anchor="right"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        PaperProps={{
          sx: { width: 320, borderRadius: '16px 0 0 16px' }
        }}
      >
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>

          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterListIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">Filter Products</Typography>
            </Box>
            <Button
              size="small"
              startIcon={<CloseIcon />}
              onClick={() => setFilterOpen(false)}
              sx={{ textTransform: 'none' }}
            >
              Close
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Category filter */}
          <Typography variant="subtitle2" fontWeight="bold"
            color="text.secondary" mb={1.5} letterSpacing={1}>
            CATEGORY
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 3 }}>
            <Box
              onClick={() => setSelectedCategory('')}
              sx={{
                px: 2, py: 1.2, borderRadius: 2, cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between',
                background: selectedCategory === '' ? '#e3f2fd' : 'transparent',
                color: selectedCategory === '' ? '#1976d2' : '#424242',
                fontWeight: selectedCategory === '' ? 'bold' : 'normal',
                fontSize: 14,
                '&:hover': { background: '#f5f5f5' }
              }}>
              <span>All Products</span>
              {selectedCategory === '' && <span>✓</span>}
            </Box>
            {categories.map(cat => (
              <Box key={cat.id}
                onClick={() => setSelectedCategory(
                  selectedCategory === cat.id ? '' : cat.id
                )}
                sx={{
                  px: 2, py: 1.2, borderRadius: 2, cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between',
                  background: selectedCategory === cat.id ? '#e3f2fd' : 'transparent',
                  color: selectedCategory === cat.id ? '#1976d2' : '#424242',
                  fontWeight: selectedCategory === cat.id ? 'bold' : 'normal',
                  fontSize: 14,
                  '&:hover': { background: '#f5f5f5' }
                }}>
                <span>{cat.name}</span>
                {selectedCategory === cat.id && <span>✓</span>}
              </Box>
            ))}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Price filter */}
          <Typography variant="subtitle2" fontWeight="bold"
            color="text.secondary" mb={1.5} letterSpacing={1}>
            PRICE RANGE
          </Typography>
          <Box sx={{
            display: 'flex', justifyContent: 'space-between', mb: 1
          }}>
            <Typography variant="body2" color="primary" fontWeight="bold">
              ₹{priceRange[0].toLocaleString()}
            </Typography>
            <Typography variant="body2" color="primary" fontWeight="bold">
              ₹{priceRange[1].toLocaleString()}
            </Typography>
          </Box>
          <Slider
            value={priceRange}
            onChange={(e, val) => setPriceRange(val)}
            min={0} max={100000} step={1000}
            sx={{ mb: 3 }}
          />

          <Divider sx={{ mb: 3 }} />

          {/* Sort filter */}
          <Typography variant="subtitle2" fontWeight="bold"
            color="text.secondary" mb={1.5} letterSpacing={1}>
            SORT BY
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 3 }}>
            {[
              { value: '', label: 'Default' },
              { value: 'price_asc', label: 'Price: Low to High' },
              { value: 'price_desc', label: 'Price: High to Low' },
              { value: 'newest', label: 'Newest First' },
            ].map(opt => (
              <Box key={opt.value}
                onClick={() => setSortBy(opt.value)}
                sx={{
                  px: 2, py: 1.2, borderRadius: 2, cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between',
                  background: sortBy === opt.value ? '#e3f2fd' : 'transparent',
                  color: sortBy === opt.value ? '#1976d2' : '#424242',
                  fontWeight: sortBy === opt.value ? 'bold' : 'normal',
                  fontSize: 14,
                  '&:hover': { background: '#f5f5f5' }
                }}>
                <span>{opt.label}</span>
                {sortBy === opt.value && <span>✓</span>}
              </Box>
            ))}
          </Box>

          {/* Bottom buttons */}
          <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
            <Button
              fullWidth variant="outlined"
              onClick={clearFilters}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Clear All
            </Button>
            <Button
              fullWidth variant="contained"
              onClick={() => { fetchProducts(); setFilterOpen(false) }}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  )
}