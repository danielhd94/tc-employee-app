import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Toolbar, IconButton, Typography, styled, Box } from '@mui/material';
import { drawerWidth } from './DrawerStyles';
import { useThemeContext } from '../theme/ThemeProvider';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useMediaQuery } from '@mui/material';

const CustomAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: theme.palette.primary.main, // Color de fondo principal
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

function CustomAppBarComponent({ open, handleDrawerOpen }) {
    const { darkMode, toggleDarkMode } = useThemeContext();
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    return (
        <CustomAppBar position="fixed" open={open}>
            <Toolbar>
                {!isMobile && ( // Muestra el botón de menú solo en móviles
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Efecto hover
                            },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    RH KOLAVAL
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Botón de conmutación para cambiar entre light y dark mode */}
                    <IconButton color="inherit" onClick={toggleDarkMode} aria-label="toggle dark mode">
                        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Box>
            </Toolbar>
        </CustomAppBar>
    );
}

export default CustomAppBarComponent;
