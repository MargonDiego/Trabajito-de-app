import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SchoolIcon from '@mui/icons-material/School';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExitToApp from '@mui/icons-material/ExitToApp';
import People from '@mui/icons-material/People';
import SupervisorAccount from '@mui/icons-material/SupervisorAccount';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface NavBarProps {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
}

const NavBar: React.FC<NavBarProps> = ({ toggleTheme, mode }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navItems = [
    { text: 'Estudiantes', icon: <People />, to: '/students', show: isAuthenticated },
    { text: 'Gestión de Usuarios', icon: <SupervisorAccount />, to: '/user-management', show: isAuthenticated && user?.role === 'admin' },
    { text: 'Perfil', icon: <AccountCircle />, to: '/profile', show: isAuthenticated },
    { text: 'Iniciar Sesión', icon: <AccountCircle />, to: '/login', show: !isAuthenticated },
    { text: 'Registrarse', icon: <AccountCircle />, to: '/register', show: !isAuthenticated },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Sistema Escolar
      </Typography>
      <List>
        {navItems.map((item) => (
          item.show && (
            <ListItem button key={item.text} component={RouterLink} to={item.to}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          )
        ))}
        {isAuthenticated && (
          <ListItem button onClick={logout}>
            <ListItemIcon><ExitToApp /></ListItemIcon>
            <ListItemText primary="Cerrar Sesión" />
          </ListItem>
        )}
        <ListItem button onClick={toggleTheme}>
          <ListItemIcon>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </ListItemIcon>
          <ListItemText primary={mode === 'dark' ? 'Modo Claro' : 'Modo Oscuro'} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <SchoolIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema Escolar
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {navItems.map((item) => (
                item.show && (
                  <Button
                    key={item.text}
                    color="inherit"
                    component={RouterLink}
                    to={item.to}
                    startIcon={item.icon}
                    sx={{ mx: 1 }}
                  >
                    {item.text}
                  </Button>
                )
              ))}
              {isAuthenticated && (
                <>
                  <Typography variant="subtitle1" sx={{ mx: 2 }}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Button
                    color="inherit"
                    onClick={logout}
                    endIcon={<ExitToApp />}
                  >
                    Cerrar Sesión
                  </Button>
                </>
              )}
              <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Toolbar />
    </>
  );
};

export default NavBar;
