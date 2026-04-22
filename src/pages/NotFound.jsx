import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Page = styled.div`
  min-height: 80vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center; padding: 2rem;
`

const Code = styled.h1`
  font-size: 6rem; font-weight: 900;
  color: ${({ theme }) => theme.colors.primary}; line-height: 1; margin-bottom: 1rem;
`

const Msg = styled.p`color: ${({ theme }) => theme.colors.textMuted}; margin-bottom: 2rem;`

const HomeBtn = styled(Link)`
  background: ${({ theme }) => theme.colors.primary}; color: #000;
  padding: 0.75rem 1.5rem; border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 700; transition: all 0.2s;
  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; color: #fff; }
`

const NotFound = () => (
  <Page>
    <Code>404</Code>
    <h2 style={{ marginBottom: '0.5rem' }}>Page not found</h2>
    <Msg>The page you're looking for doesn't exist.</Msg>
    <HomeBtn to="/">Back to Home</HomeBtn>
  </Page>
)

export default NotFound
