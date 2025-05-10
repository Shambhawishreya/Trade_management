import React, { useState } from 'react';
import { Typography, IconButton, Menu, MenuItem } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import LightModeIcon from '@mui/icons-material/LightMode';

const TradeNavbar = ({
  isDarkMode, 
  onToggleDarkMode, 
  title, 
  globalIcon,
  menuItems = [],
  githubLink = "https://github.com/Shambhawishreya/Trade_management/",
  onMenuItemClick
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ padding: "6px", position: "relative" }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        style={{
          color: isDarkMode ? "white" : "black",
          position: "relative",
        }}
      >
        {/* Globe Icon with Dropdown */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            position: "absolute",
            left: "11px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        >
          {globalIcon && (
            <img
              src={globalIcon}
              alt="Globe"
              style={{
                width: "40px",
                height: "40px",
                marginRight: "18px",
              }}
            />
          )}
          <Typography
            onMouseEnter={handleMenuOpen}
            onClick={handleMenuOpen}
            style={{
              color: isDarkMode ? "white" : "black",
              fontSize: "30px",
            }}
          >
            Menu
          </Typography>
        </div>
        
        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          onMouseLeave={handleMenuClose}
          MenuListProps={{
            onMouseLeave: handleMenuClose,
          }}
        >
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                handleMenuClose();
                if (onMenuItemClick) {
                  onMenuItemClick(item);
                }
              }}
            >
              {item.icon && (
                <img
                  src={item.icon}
                  alt={item.label}
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "8px",
                  }}
                />
              )}
              <Typography style={{color: isDarkMode ? "white" : "black"}}>
                {item.label}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
        
        {title}
      </Typography>

      {/* Right Corner Icons */}
      <div
        style={{
          position: "absolute",
          top: "8px",
          right: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {/* GitHub Icon */}
        <IconButton
          onClick={() => window.open(githubLink, "_blank")}
          color="inherit"
        >
          <GitHubIcon />
        </IconButton>

        {/* Dark/Light Mode Toggle */}
        <IconButton onClick={onToggleDarkMode} color="inherit">
          {isDarkMode ? <LightModeIcon /> : <Brightness4Icon />}
        </IconButton>
      </div>
    </div>
  );
};

export default TradeNavbar;