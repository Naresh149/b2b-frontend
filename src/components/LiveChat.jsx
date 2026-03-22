import { useState, useEffect, useRef } from 'react'
import {
  Box, Paper, Typography, TextField,
  IconButton, Avatar, Slide, Fab, List,
  ListItem, ListItemText, Divider
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import CloseIcon from '@mui/icons-material/Close'
import ChatIcon from '@mui/icons-material/Chat'
import { io } from 'socket.io-client'
import { useSelector } from 'react-redux'

const socket = io('http://localhost:5000')

export default function LiveChat() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const { user } = useSelector(state => state.auth)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (user) {
      socket.emit('join', user.id)
    }

    socket.on('receive_message', (data) => {
      setMessages(prev => [...prev, data])
    })

    return () => socket.off('receive_message')
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!message.trim()) return
    const msgData = {
      from: user.id,
      fromName: user.name,
      to: 'support',
      message: message.trim(),
      timestamp: new Date()
    }
    socket.emit('send_message', msgData)
    setMessages(prev => [...prev, { ...msgData, isMine: true }])
    setMessage('')
  }

  return (
    <>
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Paper sx={{
          position: 'fixed', bottom: 90, right: 400,
          width: 320, height: 450,
          borderRadius: 3, overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column',
          zIndex: 1300
        }}>
          {/* Header */}
          <Box sx={{
            background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
            p: 2, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 36, height: 36 }}>
                <ChatIcon sx={{ fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography fontWeight="bold" color="white" fontSize={14}>
                  Live Support
                </Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.8)">
                  We reply instantly!
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)}
              sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box sx={{
            flexGrow: 1, overflowY: 'auto', p: 2,
            display: 'flex', flexDirection: 'column',
            gap: 1, background: '#f8f9fa'
          }}>
            {messages.length === 0 && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography color="text.secondary" fontSize={13}>
                  👋 Send a message to start chatting with our support team!
                </Typography>
              </Box>
            )}
            {messages.map((msg, i) => (
              <Box key={i} sx={{
                display: 'flex',
                justifyContent: msg.isMine ? 'flex-end' : 'flex-start'
              }}>
                <Box sx={{
                  maxWidth: '80%',
                  background: msg.isMine
                    ? 'linear-gradient(135deg, #2e7d32, #66bb6a)'
                    : '#fff',
                  color: msg.isMine ? '#fff' : '#212121',
                  p: 1.5, fontSize: 13, lineHeight: 1.6,
                  borderRadius: msg.isMine
                    ? '16px 16px 4px 16px'
                    : '16px 16px 16px 4px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                }}>
                  {!msg.isMine && (
                    <Typography variant="caption" color="success.main" fontWeight="bold">
                      {msg.fromName}
                    </Typography>
                  )}
                  <Typography fontSize={13}>{msg.message}</Typography>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box sx={{
            p: 1.5, display: 'flex', gap: 1,
            background: '#fff', borderTop: '1px solid #f0f0f0'
          }}>
            <TextField
              fullWidth size="small"
              placeholder="Type your message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyPress={e => {
                if (e.key === 'Enter') { e.preventDefault(); sendMessage() }
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <IconButton onClick={sendMessage} disabled={!message.trim()}
              sx={{
                background: '#2e7d32', color: '#fff', borderRadius: 2,
                '&:hover': { background: '#1b5e20' },
                '&:disabled': { background: '#e0e0e0' }
              }}>
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      </Slide>

      {/* FAB */}
      <Fab size="medium" onClick={() => setOpen(!open)}
        sx={{
          position: 'fixed', bottom: 24, right: 100,
          background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
          color: '#fff', zIndex: 1300,
          boxShadow: '0 4px 20px rgba(46,125,50,0.4)'
        }}>
        {open ? <CloseIcon /> : <ChatIcon />}
      </Fab>
    </>
  )
}