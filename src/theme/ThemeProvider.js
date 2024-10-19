import React, { createContext, useContext, useState } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

// Crea el contexto para el tema
const ThemeContext = createContext();

// Hook para usar el contexto del tema
export const useThemeContext = () => {
    return useContext(ThemeContext);
};

// Paletas de colores para los modos claro y oscuro
const lightPalette = {
    primary: {
        main: '#1976d2', // Azul
        contrastText: '#ffffff', // Texto contrastante
    },
    secondary: {
        main: '#ff5722', // Naranja
        contrastText: '#ffffff', // Texto contrastante
    },
    background: {
        default: '#f5f5f5', // Fondo claro
        paper: '#ffffff', // Fondo de papel claro
    },
    text: {
        primary: '#333333', // Texto oscuro
        secondary: '#555555', // Texto secundario
    },
};

const darkPalette = {
    primary: {
        main: '#90caf9', // Azul claro
        contrastText: '#000000', // Texto contrastante
    },
    secondary: {
        main: '#ffab91', // Naranja claro
        contrastText: '#000000', // Texto contrastante
    },
    background: {
        default: '#121212', // Fondo oscuro
        paper: '#1d1d1d', // Fondo de papel oscuro
    },
    text: {
        primary: '#ffffff', // Texto claro
        secondary: '#e0e0e0', // Texto secundario
    },
};

// Proveedor del tema
export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    // Alternar entre modo claro y oscuro
    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    // Crear el tema basado en el modo
    const theme = createTheme({
        palette: darkMode ? darkPalette : lightPalette,
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Fuente moderna
            fontSize: 14, // Tamaño de fuente base
            h1: {
                fontSize: '2rem',
                fontWeight: 500,
                lineHeight: 1.5,
            },
            h2: {
                fontSize: '1.75rem',
                fontWeight: 500,
                lineHeight: 1.5,
            },
            h3: {
                fontSize: '1.5rem',
                fontWeight: 500,
                lineHeight: 1.5,
            },
            h4: {
                fontSize: '1.25rem',
                fontWeight: 600,
                lineHeight: 1.5,
            },
            h5: {
                fontSize: '1.125rem',
                fontWeight: 600,
                lineHeight: 1.5,
            },
            h6: {
                fontSize: '1rem',
                fontWeight: 600,
                lineHeight: 1.5,
            },
            body1: {
                fontSize: '0.875rem',
                lineHeight: 1.5,
            },
            body2: {
                fontSize: '0.875rem',
                lineHeight: 1.43,
            },
        },
        shape: {
            borderRadius: 8, // Bordes redondeados
        },
        spacing: 8, // Espaciado base (8px)
        components: {
            MuiButton: {
                defaultProps: {
                    variant: 'contained', // Establece el variante por defecto para los botones
                },
                styleOverrides: {
                    root: {
                        borderRadius: '8px', // Bordes redondeados para botones
                        padding: '6px 16px', // Padding para botones
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: '8px', // Bordes redondeados para papeles
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: '12px', // Bordes más pronunciados para tarjetas
                    },
                },
            },
        },
    });

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
