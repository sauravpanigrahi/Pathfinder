import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleHomeRedirect = () => {
    navigate('/');
  };

  const menuItems = [
    { label: 'Home', path: '/', onClick: handleHomeRedirect },
    { label: 'Discover', path: '/discover' },
    { label: 'Contact', path: '/contact' },
    { label: "Find a job" , path:'/login/student'},
    { label: "Post a job" , path:'/login/Company'}
    
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', color: "black" }}>
      <Typography
        variant="h6"
        sx={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 500,
          fontSize: '1.575rem',
          my: 2,
          color: "black"
        }}
      >
        PathFinder
      </Typography>

      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.label}
            onClick={() => item.onClick ? item.onClick() : handleNavigate(item.path)}
          >
            <ListItemText primary={item.label} sx={{ textAlign: 'center', color: "black" }} />
          </ListItem>
        ))}

        {/* <ListItem button onClick={handleMenuOpen}>
          <ListItemText primary="Account" sx={{ textAlign: 'center', color: "black" }} />
        </ListItem> */}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'white', color: "black", boxShadow: "0px 2px 10px rgba(0,0,0,0.1)" , border:"1px solid gray"}}>
        <Toolbar>

          {/* Mobile Menu Icon */}
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{  display: { sm: 'none' }, color: "black" }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo / Title */}
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 900,
              fontSize: { xs: '1.25rem', sm: '1.575rem' },
              ml: { xs: 0, sm: '4rem' },
              color: "black",
              display:"flex"
             
            }}
          >
         
            <svg 
              width="45" 
              height="45" 
              viewBox="0 0 24 24" 
              fill="black"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* <!-- Outer Circle --> */}
              <circle cx="12" cy="12" r="10" />

              {/* <!-- Compass Needle --> */}
              <polygon 
            points="12,5 7,17 12,14 17,17" 
            fill="white" 
          />

              
              {/* <!-- Center Dot --> */}
              <circle cx="12" cy="12" r="2" />
            </svg>


            PathFinder
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1, mr: '70px' }}>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                sx={{ color: "black", textTransform: 'none', fontSize: '1rem' }}
                onClick={() => item.onClick ? item.onClick() : handleNavigate(item.path)}
              >
                {item.label}
              </Button>
            ))}

            {/* Account Icon */}
            {/* <IconButton onClick={handleMenuOpen} sx={{ color: "black" }}>
              <AccountCircle />
            </IconButton> */}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Account Dropdown Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleNavigate('/signup');
            handleMenuClose();
          }}
          sx={{ color: "black" }}
        >
          Signup
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleNavigate('/login/student');
            handleMenuClose();
          }}
          sx={{ color: "black" }}
        >
          Student Login
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleNavigate('/login/Company');
            handleMenuClose();
          }}
          sx={{ color: "black" }}
        >
          Institution Login
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            color: "black"
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
