import { Box, Chip, Typography } from '@mui/material'

export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
        Categories
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label="All"
          onClick={() => onSelect('')}
          color={selected === '' ? 'primary' : 'default'}
          variant={selected === '' ? 'filled' : 'outlined'}
        />
        {categories.map(cat => (
          <Chip
            key={cat.id}
            label={cat.name}
            onClick={() => onSelect(cat.id)}
            color={selected === cat.id ? 'primary' : 'default'}
            variant={selected === cat.id ? 'filled' : 'outlined'}
          />
        ))}
      </Box>
    </Box>
  )
}