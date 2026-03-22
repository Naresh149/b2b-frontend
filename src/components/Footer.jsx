import { Box, Container, Grid, Typography, Divider, IconButton } from '@mui/material'

export default function Footer() {
  return (
    <Box sx={{ background: '#1a1a2e', color: '#ccc', mt: 8 }}>
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: 2,
                background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>B</Typography>
              </Box>
              <Typography fontWeight="bold" fontSize={18} color="white">B2B Shop</Typography>
            </Box>
            <Typography variant="body2" color="#888" lineHeight={1.8}>
              India's largest B2B wholesale platform connecting buyers and sellers across all industries.
            </Typography>
          </Grid>

          {[
            {
              title: 'Quick Links',
              links: ['Home', 'Products', 'Categories', 'About Us', 'Contact']
            },
            {
              title: 'Categories',
              links: ['Electronics', 'Furniture', 'Clothing', 'Food', 'Machinery']
            },
            {
              title: 'Support',
              links: ['Help Center', 'Track Order', 'Return Policy', 'Privacy Policy', 'Terms']
            }
          ].map((col, i) => (
            <Grid item xs={6} md={2} key={i}>
              <Typography fontWeight="bold" color="white" mb={2}>{col.title}</Typography>
              {col.links.map(link => (
                <Typography key={link} variant="body2" color="#888"
                  sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#42a5f5' } }}>
                  {link}
                </Typography>
              ))}
            </Grid>
          ))}

          <Grid item xs={12} md={3}>
            <Typography fontWeight="bold" color="white" mb={2}>Contact Us</Typography>
            <Typography variant="body2" color="#888" mb={1}>📞 1800-123-4567</Typography>
            <Typography variant="body2" color="#888" mb={1}>✉️ support@b2bshop.com</Typography>
            <Typography variant="body2" color="#888" mb={2}>📍 Mumbai, Maharashtra, India</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['FB', 'TW', 'IN', 'YT'].map(s => (
                <Box key={s} sx={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: '#2a2a4a', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: 12, color: '#90caf9',
                  '&:hover': { background: '#1976d2', color: '#fff' }
                }}>
                  {s}
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: '#2a2a4a', my: 4 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" color="#666">
            © 2024 B2B Shop. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {['Visa', 'Mastercard', 'UPI', 'NetBanking'].map(p => (
              <Typography key={p} variant="caption"
                sx={{
                  px: 1.5, py: 0.5, borderRadius: 1,
                  background: '#2a2a4a', color: '#90caf9'
                }}>
                {p}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}