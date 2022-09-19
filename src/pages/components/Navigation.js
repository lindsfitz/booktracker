import React, { useState, useContext } from 'react';
import { Link, useNavigate, NavLink } from "react-router-dom";
import AppContext from '../../AppContext';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, ListItemIcon, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const Navigation = () => {
    const context = useContext(AppContext);
    let navigate = useNavigate();

    let activeStyle = {
        textDecoration: "underline",
        cursor: 'default',
        pointeEvents: 'none',
        color:'#637086'
    };

    let inactiveStyle = {
        textDecoration: 'none',
        color:'#637086'
    }

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logout = () => {
        localStorage.removeItem("token");
        context.setToken('');
        context.setUserData(null);
        navigate('/login')
    }

    return (
        <AppBar position="static" id='nav'>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        BOOKTRACKER
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                            
                        >

                            <MenuItem>
                                <Typography textAlign="center">
                                    <NavLink to='/' style={({ isActive }) =>
                                        isActive ? activeStyle : inactiveStyle
                                    }>Home</NavLink>
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">
                                    <NavLink to='/shelves' style={({ isActive }) =>
                                        isActive ? activeStyle : inactiveStyle
                                    }>Bookcase</NavLink>
                                </Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography textAlign="center">
                                    <NavLink to='/search' style={({ isActive }) =>
                                        isActive ? activeStyle : inactiveStyle
                                    }>Browse</NavLink>
                                </Typography>
                            </MenuItem>

                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        BOOKTRACKER
                    </Typography>
                    <Box sx={{ color: 'white', flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button variant="text">
                            <NavLink to='/' style={({ isActive }) =>
                                isActive ? activeStyle : inactiveStyle
                            }>Home</NavLink>
                        </Button>
                        <Button variant="text">
                            <NavLink to='/shelves' style={({ isActive }) =>
                                isActive ? activeStyle : inactiveStyle
                            }>Bookcase</NavLink>
                        </Button>
                        <Button variant="text">
                            <NavLink to='/search' style={({ isActive }) =>
                                isActive ? activeStyle : inactiveStyle
                            }>Browse</NavLink>
                        </Button>
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar>{context.userData.username.charAt(0)}</Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem>
                                <ListItemIcon>
                                    <PersonIcon fontSize="small" />
                                </ListItemIcon>
                                Profile
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon>
                                    <PersonAdd fontSize="small" />
                                </ListItemIcon>
                                Friends
                            </MenuItem>
                            <MenuItem onClick={context.toggleShelfDialog}>
                                <ListItemIcon>
                                    <MenuBookIcon fontSize='small' />
                                </ListItemIcon>
                                New Shelf
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon>
                                    <MenuBookIcon fontSize='small' />
                                </ListItemIcon>
                                <Link to='/books'>
                                    My Books

                                </Link>
                            </MenuItem>
                            <Divider />
                            <MenuItem>
                                <ListItemIcon>
                                    <Settings fontSize="small" />
                                </ListItemIcon>
                                Settings
                            </MenuItem>
                            <MenuItem onClick={logout}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default Navigation;