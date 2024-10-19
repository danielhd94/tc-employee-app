import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';

function MobileNavigation() {
    const menuItems = [
        { text: 'Home', to: '/', icon: <HomeIcon /> },
        { text: 'Department', to: '/department', icon: <BusinessIcon /> },
        { text: 'Employee', to: '/employee', icon: <PersonIcon /> },
    ];

    return (
        <BottomNavigation
            sx={{ display: { xs: 'flex', md: 'none' }, position: 'fixed', bottom: 0, left: 0, right: 0 }}
        >
            {menuItems.map((item) => (
                <BottomNavigationAction
                    key={item.text}
                    component={Link}
                    to={item.to}
                    label={item.text}
                    icon={item.icon}
                />
            ))}
        </BottomNavigation>
    );
}

export default MobileNavigation;
