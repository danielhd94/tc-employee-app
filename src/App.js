import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ThemeProvider } from './theme/ThemeProvider';
import CustomAppBar from './components/AppBar';
import CustomDrawer from './components/Drawer';
import MobileNavigation from './components/MobileNavigation';
import Home from './Home';
import Department from './components/Department';
import Employee from './components/Employee';
import TimeSheet from './components/TimeSheet';
import WeeklyReport from './components/WeeklyReport';
import { useMediaQuery } from '@mui/material';


function App() {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm')); // Verifica si está en móvil

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          {isMobile ? (
            <MobileNavigation handleDrawerOpen={handleDrawerOpen} />
          ) : (
            <CustomAppBar open={open} handleDrawerOpen={handleDrawerOpen} />
          )}
          {!isMobile && <CustomDrawer open={open} handleDrawerClose={handleDrawerClose} />}

          <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/department" element={<Department />} />
              <Route path="/employee" element={<Employee />} />
              <Route path="/timesheet" element={<TimeSheet />} />
              <Route path="/report" element={<WeeklyReport />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
