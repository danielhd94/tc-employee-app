import React from 'react';
import { Drawer as MuiDrawer, IconButton, styled, useMediaQuery } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Sidebar from './Sidebar';
import { openedMixin, closedMixin } from './DrawerStyles'; // Importa las constantes desde un archivo separado
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open ? openedMixin(theme) : closedMixin(theme)),
        '& .MuiDrawer-paper': (open ? openedMixin(theme) : closedMixin(theme)),
    }),
);

function CustomDrawer({ open, handleDrawerClose }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Verifica si está en móvil

    React.useEffect(() => {
        if (isMobile && open) {
            handleDrawerClose(); // Cierra el drawer en móvil
        }
    }, [isMobile, open, handleDrawerClose]);

    return (
        <Drawer variant="permanent" open={open}>
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <Sidebar open={open} />
        </Drawer>
    );
}

export default CustomDrawer;
