import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles, theme } from './styles/GlobalStyles'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import EventsPage from './pages/events/EventsPage'
import EventDetail from './pages/events/EventDetail'
import CreateEvent from './pages/events/CreateEvent'
import EditEvent from './pages/events/EditEvent'
import Dashboard from './pages/dashboard/Dashboard'
import NotFound from './pages/NotFound'

const AppContent = () => {
  useAuth()
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/create" element={
          <ProtectedRoute><CreateEvent /></ProtectedRoute>
        } />
        <Route path="/events/edit/:id" element={
          <ProtectedRoute><EditEvent /></ProtectedRoute>
        } />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

const App = () => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppContent />
    </ThemeProvider>
  </BrowserRouter>
)

export default App
