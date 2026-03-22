import { useState, useEffect } from 'react'
import {
  IconButton, Badge, Popover, Box, Typography,
  List, ListItem, ListItemText, Button, Divider, Chip
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import DeleteIcon from '@mui/icons-material/Delete'
import API from '../utils/api'
import { toast } from 'react-toastify'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications')
      setNotifications(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter(n => !n.is_read).length

  const markAllRead = async () => {
    try {
      await API.put('/notifications/read-all')
      fetchNotifications()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`)
      fetchNotifications()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <IconButton onClick={e => {
        setAnchorEl(e.currentTarget)
        if (unreadCount > 0) markAllRead()
      }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ color: '#1976d2' }} />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 360, borderRadius: 3, mt: 1 } }}
      >
        <Box sx={{
          p: 2, display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Typography fontWeight="bold">🔔 Notifications</Typography>
          {notifications.length > 0 && (
            <Button size="small" onClick={markAllRead}>
              Mark all read
            </Button>
          )}
        </Box>

        {notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No notifications!</Typography>
          </Box>
        ) : (
          <List sx={{ maxHeight: 400, overflowY: 'auto', p: 0 }}>
            {notifications.map((notif, index) => (
              <Box key={notif.id}>
                <ListItem
                  sx={{
                    background: notif.is_read ? 'transparent' : '#e3f2fd',
                    '&:hover': { background: '#f5f5f5' }
                  }}
                  secondaryAction={
                    <IconButton size="small" edge="end"
                      onClick={() => deleteNotification(notif.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={notif.is_read ? 'normal' : 'bold'}>
                        {notif.message}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notif.created_at).toLocaleDateString('en-IN')}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </Popover>
    </>
  )
}