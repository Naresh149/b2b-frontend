import { useState, useRef, useEffect } from 'react'
import {
  Box, Paper, Typography, TextField, IconButton,
  Avatar, CircularProgress, Fab, Slide
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import CloseIcon from '@mui/icons-material/Close'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import API from '../utils/api'

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: '👋 Hi! I am your B2B Shop assistant! I can help you:\n\n🔍 Search products\n🛒 Check your cart\n📦 Track your orders\n❓ Answer any questions\n\nHow can I help you today?'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setLoading(true)

    try {
      const res = await API.post('/chatbot', { message: userMessage })
      setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: '❌ Sorry, I am having trouble right now. Please try again!'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Window */}
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Paper sx={{
          position: 'fixed', bottom: 90, right: 24,
          width: 360, height: 500,
          borderRadius: 3, overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column',
          zIndex: 1300
        }}>
          {/* Header */}
          <Box sx={{
            background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
            p: 2, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 36, height: 36 }}>
                <SmartToyIcon sx={{ fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography fontWeight="bold" color="white" fontSize={14}>
                  B2B Assistant
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#69f0ae'
                  }} />
                  <Typography variant="caption" color="rgba(255,255,255,0.8)">
                    Online
                  </Typography>
                </Box>
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
            display: 'flex', flexDirection: 'column', gap: 1.5,
            background: '#f8f9fa'
          }}>
            {messages.map((msg, i) => (
              <Box key={i} sx={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                gap: 1, alignItems: 'flex-end'
              }}>
                {msg.role === 'bot' && (
                  <Avatar sx={{ bgcolor: '#1976d2', width: 28, height: 28, flexShrink: 0 }}>
                    <SmartToyIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                )}
                <Box sx={{
                  maxWidth: '80%',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #1976d2, #42a5f5)'
                    : '#fff',
                  color: msg.role === 'user' ? '#fff' : '#212121',
                  p: 1.5, borderRadius: msg.role === 'user'
                    ? '16px 16px 4px 16px'
                    : '16px 16px 16px 4px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                  fontSize: 13, lineHeight: 1.6,
                  whiteSpace: 'pre-line'
                }}>
                  {msg.text}
                </Box>
                {msg.role === 'user' && (
                  <Avatar sx={{ bgcolor: '#e0e0e0', width: 28, height: 28, flexShrink: 0 }}>
                    <PersonIcon sx={{ fontSize: 16, color: '#757575' }} />
                  </Avatar>
                )}
              </Box>
            ))}

            {loading && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#1976d2', width: 28, height: 28 }}>
                  <SmartToyIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Box sx={{
                  background: '#fff', p: 1.5, borderRadius: '16px 16px 16px 4px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                }}>
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <Box key={i} sx={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: '#1976d2', opacity: 0.6,
                        animation: 'bounce 1s infinite',
                        animationDelay: `${i * 0.2}s`,
                        '@keyframes bounce': {
                          '0%, 100%': { transform: 'translateY(0)' },
                          '50%': { transform: 'translateY(-4px)' }
                        }
                      }} />
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Quick Suggestions */}
          <Box sx={{
            px: 2, py: 1, display: 'flex', gap: 1,
            overflowX: 'auto', background: '#fff',
            borderTop: '1px solid #f0f0f0'
          }}>
            {[
              'Show laptops',
              'My cart',
              'My orders',
              'Best deals'
            ].map(suggestion => (
              <Box key={suggestion}
                onClick={() => {
                  setInput(suggestion)
                }}
                sx={{
                  px: 1.5, py: 0.5, borderRadius: 10,
                  background: '#e3f2fd', color: '#1976d2',
                  fontSize: 12, whiteSpace: 'nowrap',
                  cursor: 'pointer', flexShrink: 0,
                  '&:hover': { background: '#bbdefb' }
                }}>
                {suggestion}
              </Box>
            ))}
          </Box>

          {/* Input */}
          <Box sx={{
            p: 1.5, display: 'flex', gap: 1,
            background: '#fff', borderTop: '1px solid #f0f0f0'
          }}>
            <TextField
              fullWidth size="small"
              placeholder="Ask me anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              multiline maxRows={3}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 3 }
              }}
            />
            <IconButton
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              sx={{
                background: '#1976d2', color: '#fff',
                borderRadius: 2, px: 1.5,
                '&:hover': { background: '#1565c0' },
                '&:disabled': { background: '#e0e0e0' }
              }}>
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      </Slide>

      {/* FAB Button */}
      <Fab
        onClick={() => setOpen(!open)}
        sx={{
          position: 'fixed', bottom: 24, right: 24,
          background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
          color: '#fff', zIndex: 1300,
          '&:hover': { background: 'linear-gradient(135deg, #1565c0, #1976d2)' },
          boxShadow: '0 4px 20px rgba(25,118,210,0.4)'
        }}>
        {open ? <CloseIcon /> : <SmartToyIcon />}
      </Fab>
    </>
  )
}