import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ThemeProvider } from './theme/ThemeProvider'; // Importa useThemeContext desde el ThemeProvider
import CustomAppBar from './components/AppBar';
import CustomDrawer from './components/Drawer';
import Home from './Home';
import Department from './components/Department';
import Employee from './components/Employee';

function App() {
  const [open, setOpen] = useState(false);

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
          <CustomAppBar open={open} handleDrawerOpen={handleDrawerOpen} /> {/* Pasa toggleDarkMode al AppBar */}
          <CustomDrawer open={open} handleDrawerClose={handleDrawerClose} />
          <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/department" element={<Department />} />
              <Route path="/employee" element={<Employee />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
