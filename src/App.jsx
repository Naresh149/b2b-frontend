import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import SellerProducts from './pages/seller/SellerProducts'
import SellerDashboard from './pages/seller/SellerDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import BuyerDashboard from './pages/buyer/BuyerDashboard'
import ChatBot from './components/ChatBot'
import LiveChat from './components/LiveChat'

function ProtectedRoute({ children, roles }) {
  const { isLoggedIn, user } = useSelector(state => state.auth)
  if (!isLoggedIn) return <Navigate to="/" />
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" />
  return children
}

export default function App() {
  const { isLoggedIn, user } = useSelector(state => state.auth)

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={
          <ProtectedRoute><Home /></ProtectedRoute>
        } />
        <Route path="/product/:id" element={
          <ProtectedRoute><ProductDetail /></ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute roles={['buyer']}><Cart /></ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute roles={['buyer']}><Checkout /></ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute><Orders /></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute roles={['buyer']}><BuyerDashboard /></ProtectedRoute>
        } />
        <Route path="/seller" element={
          <ProtectedRoute roles={['seller', 'admin']}><SellerDashboard /></ProtectedRoute>
        } />
        <Route path="/seller/products" element={
          <ProtectedRoute roles={['seller', 'admin']}><SellerProducts /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
        } />
      </Routes>

      {/* Show chatbot and live chat when logged in */}
      {isLoggedIn && (
        <>
          <ChatBot />
          <LiveChat />
        </>
      )}
    </>
  )
}