import { useState } from 'react'
import {
  AppBar, Toolbar, Typography, Button, Badge,
  Box, IconButton, InputBase, Avatar, Menu,
  MenuItem, Divider, Container
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import DashboardIcon from '@mui/icons-material/Dashboard'
import InventoryIcon from '@mui/icons-material/Inventory'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../redux/authSlice'
import NotificationBell from './NotificationBell'



export default function Navbar({ onSearch }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
const { count } = useSelector(state => state.cart)
  const [anchorEl, setAnchorEl] = useState(null)
  const [search, setSearch] = useState('')

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (onSearch) onSearch(search)
  }

  return (
    <>
      {/* Top bar */}
      <Box sx={{ background: '#1565c0', py: 0.5 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#90caf9' }}>
              Free shipping on orders above ₹10,000 | B2B Wholesale Platform
            </Typography>
            <Typography variant="caption" sx={{ color: '#90caf9' }}>
              📞 1800-123-4567 | support@b2bshop.com
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main navbar */}
      <AppBar position="sticky" elevation={0} sx={{
        background: '#fff',
        borderBottom: '1px solid #e0e0e0',
        color: '#212121'
      }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1, gap: 2 }}>

            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', mr: 3 }}
              onClick={() => navigate('/home')}>
              <Box sx={{
                width: 36, height: 36, borderRadius: 2,
                background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>B</Typography>
              </Box>
              <Box>
                <Typography fontWeight="bold" fontSize={18} color="#1976d2" lineHeight={1}>
                  B2B Shop
                </Typography>
                <Typography variant="caption" color="text.secondary" lineHeight={1}>
                  Wholesale Platform
                </Typography>
              </Box>
            </Box>

            {/* Search */}
            <Box component="form" onSubmit={handleSearch} sx={{
              flexGrow: 1, display: 'flex', alignItems: 'center',
              background: '#f5f5f5', borderRadius: 2,
              border: '2px solid transparent',
              '&:focus-within': { border: '2px solid #1976d2', background: '#fff' },
              px: 2, py: 0.8
            }}>
              <SearchIcon sx={{ color: '#9e9e9e', mr: 1 }} />
              <InputBase
                fullWidth
                placeholder="Search products, categories, brands..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ fontSize: 15 }}
              />
              <Button type="submit" variant="contained" size="small"
                sx={{ borderRadius: 1.5, px: 2, textTransform: 'none' }}>
                Search
              </Button>
            </Box>

            {/* Right side */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationBell />
              {user?.role === 'buyer' && (
                <IconButton onClick={() => navigate('/cart')} sx={{ position: 'relative' }}>
                  <Badge badgeContent={count} color="error">
                    <ShoppingCartIcon sx={{ color: '#1976d2' }} />
                  </Badge>
                </IconButton>
              )}

              {/* User menu */}
              <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                cursor: 'pointer', px: 1.5, py: 0.8,
                borderRadius: 2, '&:hover': { background: '#f5f5f5' }
              }}
                onClick={e => setAnchorEl(e.currentTarget)}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2', fontSize: 14 }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography fontSize={13} fontWeight="bold" lineHeight={1}>
                    {user?.name?.split(' ')[0]}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" lineHeight={1}
                    sx={{ textTransform: 'capitalize' }}>
                    {user?.role}
                  </Typography>
                </Box>
              </Box>

              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{ sx: { borderRadius: 2, minWidth: 200, mt: 1 } }}>
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography fontWeight="bold">{user?.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null) }}>
                  <PersonIcon fontSize="small" sx={{ mr: 1.5 }} /> My Profile
                </MenuItem>
                {user?.role === 'seller' && (
                  <MenuItem onClick={() => { navigate('/seller/products'); setAnchorEl(null) }}>
                    <InventoryIcon fontSize="small" sx={{ mr: 1.5 }} /> My Products
                  </MenuItem>
                )}

{user?.role === 'buyer' && (
  <Button color="inherit" onClick={() => navigate('/dashboard')}
    sx={{ color: '#424242', textTransform: 'none' }}>
    My Dashboard
  </Button>
)}
                {user?.role === 'admin' && (
                  <MenuItem onClick={() => { navigate('/admin'); setAnchorEl(null) }}>
                    <DashboardIcon fontSize="small" sx={{ mr: 1.5 }} /> Admin Dashboard
                  </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>

        {/* Category nav bar */}
        <Box sx={{ borderTop: '1px solid #f0f0f0', background: '#fff' }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', gap: 0.5, py: 0.5, overflowX: 'auto' }}>
              {['All Products', 'Electronics', 'Furniture', 'Clothing', 'Food', 'Machinery'].map(cat => (
                <Button key={cat} size="small"
                  sx={{
                    textTransform: 'none', color: '#424242', whiteSpace: 'nowrap',
                    borderRadius: 1.5, px: 2,
                    '&:hover': { background: '#e3f2fd', color: '#1976d2' }
                  }}>
                  {cat}
                </Button>
              ))}
            </Box>
          </Container>
        </Box>
      </AppBar>
    </>
  )
}