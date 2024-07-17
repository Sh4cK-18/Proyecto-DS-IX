import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer, Toolbar, Typography, Divider, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import RouteIcon from '@mui/icons-material/Route';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    document.cookie = 'token=; path=/; domain=' + window.location.hostname + '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.removeItem('userId');
    router.push('/');
  };

  const getLinkStyle = (path) => {
    return router.pathname === path
      ? {
          backgroundColor: '#fff',
          color: '#162B4E',
          marginBottom: 3,
          borderRadius: 2,
          transition: 'all 0.3s ease-in-out',
          '&:hover': { backgroundColor: '#fff', color: '#162B4E' },
        }
      : {
          marginBottom: 3,
          borderRadius: 2,
          transition: 'all 0.3s ease-in-out',
          '&:hover': { backgroundColor: '#fff', color: '#162B4E' },
        };
  };

  const getIconStyle = (path) => {
    return router.pathname === path
      ? { color: '#162B4E' }
      : { color: '#fff' };
  };

  const getHoverIconStyle = (path) => {
    return {
      '&:hover .MuiSvgIcon-root': {
        color: '#162B4E',
      },
    };
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: 240, 
          boxSizing: 'border-box',
          backgroundColor: '#162B4E',
          color: '#fff',
          paddingTop: '10px',
        },
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
        <Typography variant="h6" noWrap>
          Dashboard
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: '#fff' }} />
      <List sx={{ padding: '10px 0' }}>
        <Link href="/dashboard" passHref>
          <ListItem disablePadding>
            <ListItemButton sx={{ ...getLinkStyle('/dashboard'), ...getHoverIconStyle('/dashboard') }}>
              <ListItemIcon sx={getIconStyle('/dashboard')}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Inicio" sx={{ color: 'inherit' }} />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link href="/dashboard/routes" passHref>
          <ListItem disablePadding>
            <ListItemButton sx={{ ...getLinkStyle('/dashboard/routes'), ...getHoverIconStyle('/dashboard/routes') }}>
              <ListItemIcon sx={getIconStyle('/dashboard/routes')}>
                <RouteIcon />
              </ListItemIcon>
              <ListItemText primary="Rutas" sx={{ color: 'inherit' }} />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link href="/dashboard/users" passHref>
          <ListItem disablePadding>
            <ListItemButton sx={{ ...getLinkStyle('/dashboard/users'), ...getHoverIconStyle('/dashboard/users') }}>
              <ListItemIcon sx={getIconStyle('/dashboard/users')}>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Usuarios" sx={{ color: 'inherit' }} />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link href="/dashboard/profile" passHref>
          <ListItem disablePadding>
            <ListItemButton sx={{ ...getLinkStyle('/dashboard/profile'), ...getHoverIconStyle('/dashboard/profile') }}>
              <ListItemIcon sx={getIconStyle('/dashboard/profile')}>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Perfil" sx={{ color: 'inherit' }} />
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ borderColor: '#fff' }} />
      <ListItem disablePadding sx={{ padding: '10px 0' }} onClick={handleLogout}>
        <ListItemButton sx={{ ...getLinkStyle('/logout'), ...getHoverIconStyle('/logout') }}>
          <ListItemIcon sx={getIconStyle('/logout')}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar sesión" sx={{ color: 'inherit' }} />
        </ListItemButton>
      </ListItem>
    </Drawer>
  );
};

export default Sidebar;
