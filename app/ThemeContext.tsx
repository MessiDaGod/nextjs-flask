// ThemeContext.tsx
'use client'
import {createTheme, ThemeProvider as MUIThemeProvider} from '@mui/material/styles'
import React, {createContext, useContext, useState, useEffect} from 'react'

interface ThemeContextType {
  breakpoints: any
  theme: string
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [theme, setTheme] = useState('light')

  // Define light and dark themes
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {main: '#1976d2'},
      background: {default: '#f5f5f5'},
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h2: {
        fontSize: '1.5rem',
        fontWeight: 500,
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderColor: '#000',
          },
        },
      },
    },
  })

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {main: '#90caf9'},
      background: {default: '#010409'},
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h2: {
        fontSize: '1.5rem',
        fontWeight: 500,
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderColor: '#fff',
          },
        },
      },
    },
  })

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const root = window.document.documentElement
    const newTheme = theme === 'light' ? 'dark' : 'light'
    root.classList.remove(theme)
    root.classList.add(newTheme)
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  // Apply saved theme or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
      window.document.documentElement.classList.add(savedTheme)
    }
    if (!savedTheme) {
      setTheme('light')
      window.document.documentElement.classList.add('light')
      localStorage.setItem('theme', 'light')
    }

    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDarkMode) {
      setTheme('dark')
      window.document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
  }, [])

  const breakpoints = lightTheme.breakpoints

  return (
    <ThemeContext.Provider value={{theme, breakpoints, toggleTheme}}>
      <MUIThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  )
}

// Custom hook to access theme
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
