import styled, { keyframes } from 'styled-components'

const spin = keyframes`to { transform: rotate(360deg); }`

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
`

const Circle = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`

const Spinner = () => <Wrap><Circle /></Wrap>
export default Spinner
