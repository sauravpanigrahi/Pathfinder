import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import { useNavigate } from "react-router-dom";
import NotificationsPanel from "./NotificationsPanel";
import "../css/navbar.css";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const userID = localStorage.getItem("userUID");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintMessage, setHintMessage] = useState("");
  const [hintShownOnce, setHintShownOnce] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleHomeRedirect = () => {
    navigate("/home");
  };

  // Fetch unread notification count
  useEffect(() => {
    if (userID) {
      fetchUnreadCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [userID]);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(
        `https://pathfinder-maob.onrender.com/notifications/${userID}/unread-count`,
        { withCredentials: true },
      );
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleNotificationsClick = () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen) {
      // Refresh notifications when opening
      fetchUnreadCount();
    }
  };
  useEffect(() => {
    if (userID && !hintShownOnce) {
      profilecheck();
    }
  }, [userID]);

  const profilecheck = async () => {
    try {
      const res = await axios.get(
        `https://pathfinder-maob.onrender.com/profile/check/${userID}`,
        { withCredentials: true },
      );
      console.log("PROFILE CHECK RESPONSE 👉", res.data);
      if (res.data.message && !hintShownOnce) {
        setHintMessage(res.data.message);
        setShowHint(true);
        setHintShownOnce(true);

        setTimeout(() => {
          setShowHint(false);
        }, 15000); // 5 seconds
      }
    } catch (err) {
      console.log("profile check error", err);
    }
  };

  const menuItems = [
    { label: "Home", path: "/home", onClick: handleHomeRedirect },
    { label: "Jobs", path: "/listedjobs" },
    { label: "Blogs", path: "/blogs" },
    { label: "Contact", path: "/contact" },
    {
      label: "Profile",
      path: `/settings/${userID}`,
      icon: <AccountCircleIcon />,
    },
  ];

  /* ---------------- Mobile Drawer ---------------- */
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          fontSize: "1.575rem",
          my: 2,
        }}
      >
        PathFinder
      </Typography>

      <List>
        {menuItems.map((item) => (
          <ListItem
            // button
            key={item.label}
            onClick={() =>
              item.onClick ? item.onClick() : handleNavigate(item.path)
            }
          >
            <ListItemText primary={item.label} sx={{ textAlign: "center" }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* ---------------- AppBar ---------------- */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          color: "black",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Toolbar>
          {/* ☰ Mobile Menu Icon */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo / Title */}
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: { xs: "1.25rem", sm: "1.575rem" },
              ml: { xs: 0, sm: "4rem" },
              display: "flex",
              alignItems: "center",
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

          {/* 🔔 Notification Bell (VISIBLE ON ALL SCREENS) */}
          <IconButton
            color="inherit"
            sx={{ mr: { xs: 1, sm: 2 } }}
            onClick={handleNotificationsClick}
          >
            <Badge
              badgeContent={unreadCount > 0 ? unreadCount : 0}
              color="error"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Desktop Menu (HIDDEN ON MOBILE) */}
          <Box
            sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}
          >
            {menuItems.map((item) => {
              // 👉 PROFILE SPECIAL CASE
              if (item.label === "Profile") {
                return (
                  <Box key={item.label} sx={{ position: "relative" }}>
                    <Button
                      color="inherit"
                      startIcon={item.icon}
                      className="profile-btn"
                      onClick={() => handleNavigate(item.path)}
                    >
                      {item.label}
                    </Button>

                    {showHint && (
                      <Box className="profile-hint">{hintMessage}</Box>
                    )}
                  </Box>
                );
              }

              // 👉 NORMAL BUTTONS
              return (
                <Button
                  key={item.label}
                  color="inherit"
                  onClick={() =>
                    item.onClick ? item.onClick() : handleNavigate(item.path)
                  }
                  startIcon={item.icon}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </AppBar>

      {/* ---------------- Mobile Drawer ---------------- */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        userUID={userID}
        onUnreadCountChange={setUnreadCount}
      />
    </>
  );
}
