import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function BackBar() {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'white',
        color: 'black',
        boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <Toolbar>
        {/* Back Button */}
        <IconButton onClick={() => navigate(-1)} edge="start">
          <ArrowBackIcon />
        </IconButton>


        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            ml: 5,
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
             fontSize: { xs: '1.25rem', sm: '1.575rem' },
             display:"flex",
            alignItems:"center"
          }}
        >
             <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="black"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: 8 }}
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="12,5 7,17 12,14 17,17" fill="white" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          PathFinder
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
