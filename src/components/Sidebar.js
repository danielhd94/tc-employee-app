import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Divider from '@mui/material/Divider';

function Sidebar({ open }) {
    const menuItems = [
        { text: 'Home', to: '/', icon: <HomeIcon /> },
        { text: 'Department', to: '/department', icon: <BusinessIcon /> },
        { text: 'Employee', to: '/employee', icon: <PersonIcon /> },
        { text: 'Time Sheet', to: '/timesheet', icon: <AccessTimeIcon /> },
        { text: 'Weekly Report', to: '/report', icon: <AssessmentIcon /> },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            component={Link}
                            to={item.to}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
        </Box>
    );
}

export default Sidebar;