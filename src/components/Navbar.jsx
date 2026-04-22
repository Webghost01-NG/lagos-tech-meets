import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { logoutUser } from '../features/auth/authSlice'
import { FiCalendar, FiLogOut, FiUser, FiMenu, FiX, FiPlusCircle } from 'react-icons/fi'

const Nav = styled.nav`
  background: ${({ theme }) => theme.colors.bgCard};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0 2rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 999;
`

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.primary};
  span { color: ${({ theme }) => theme.colors.text}; }
`

const Flag = styled.span`
  font-size: 1.2rem;
`

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 64px;
    left: 0; right: 0;
    background: ${({ theme }) => theme.colors.bgCard};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding: 1rem 2rem;
    gap: 1rem;
    z-index: 998;
  }
`

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`

const CreateBtn = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: ${({ theme }) => theme.colors.primary};
  color: #000;
  padding: 0.45rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 700;
  font-size: 0.85rem;
  transition: background 0.2s;
  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; color: #fff; }
`

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: all 0.2s;
  &:hover { background: ${({ theme }) => theme.colors.bgLight}; color: ${({ theme }) => theme.colors.danger}; }
`

const MenuBtn = styled.button`
  display: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.4rem;
  @media (max-width: 768px) { display: flex; }
`

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <Nav>
      <Logo to="/"><Flag>🇳🇬</Flag> Lagos <span>Tech Meets</span></Logo>
      <MenuBtn onClick={() => setOpen(o => !o)}>{open ? <FiX /> : <FiMenu />}</MenuBtn>
      <NavLinks $open={open}>
        <NavLink to="/events"><FiCalendar size={14} /> Events</NavLink>
        {user ? (
          <>
            <NavLink to="/dashboard"><FiUser size={14} /> Dashboard</NavLink>
            <CreateBtn to="/events/create"><FiPlusCircle size={14} /> Create Event</CreateBtn>
            <LogoutBtn onClick={handleLogout}><FiLogOut size={14} /> Logout</LogoutBtn>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <CreateBtn to="/register">Join Free</CreateBtn>
          </>
        )}
      </NavLinks>
    </Nav>
  )
}

export default Navbar
