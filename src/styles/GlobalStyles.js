import { createGlobalStyle } from 'styled-components'

export const theme = {
  colors: {
    primary: '#00C853',
    primaryDark: '#009624',
    secondary: '#FF6D00',
    bg: '#0A0A0A',
    bgCard: '#111111',
    bgLight: '#1A1A1A',
    border: '#242424',
    text: '#F0F0F0',
    textMuted: '#777777',
    success: '#00C853',
    warning: '#FF6D00',
    danger: '#FF3D3D',
    white: '#FFFFFF',
    naija1: '#008751',
    naija2: '#FFFFFF',
  },
  fonts: {
    body: "'Inter', sans-serif",
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '24px',
  },
}

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.body};
    line-height: 1.6;
    min-height: 100vh;
  }

  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; border: none; outline: none; font-family: inherit; }
  input, textarea, select { font-family: inherit; }

  /* Leaflet fix for dark theme */
  .leaflet-container {
    background: #1a1a1a;
    border-radius: 12px;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${({ theme }) => theme.colors.bg}; }
  ::-webkit-scrollbar-thumb { background: ${({ theme }) => theme.colors.border}; border-radius: 3px; }
`
