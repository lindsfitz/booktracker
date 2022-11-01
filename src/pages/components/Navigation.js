import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import AppContext from '../../AppContext';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, ListItemIcon, Divider, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { createSvgIcon } from '@mui/material/utils';
import AdbIcon from '@mui/icons-material/Adb';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';


const BookendR = createSvgIcon()

const Navigation = () => {
    const context = useContext(AppContext);
    const location = useLocation()
    let navigate = useNavigate();
    const theme = useTheme();
    // const xs = useMediaQuery('(max-width:450px)')
    const smxs = useMediaQuery(theme.breakpoints.down('sm'))

    // const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    // const handleOpenNavMenu = (event) => {
    //     setAnchorElNav(event.currentTarget);
    // };
    
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    // const handleCloseNavMenu = () => {
    //     setAnchorElNav(null);
    // };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logout = () => {
        localStorage.removeItem("token");
        context.setToken('');
        context.setUserData(null);
        navigate('/login')
    }

    const backBtn = () => {
        if (location.pathname === '/books/read' || location.pathname === '/books/currently' || location.pathname === '/books/dnf' || location.pathname === '/books/owned' || location.pathname === '/activity' || location.pathname.includes('/book/')) {
            return (
                <IconButton onClick={()=>navigate(-1)}><ArrowBackIosIcon /></IconButton>
            )
        }
    }

    return (
        <AppBar position="static" id='nav'>
            <Container maxWidth="xl">
                <Toolbar disableGutters>

                    {smxs ? (
                        <React.Fragment>
                            {/* <IconButton><ArrowBackIosIcon /></IconButton> */}
                            {backBtn()}
                            <img style={{height:'40px'}} src='/assets/booked.png' />
                            
                            <Typography
                                variant="h5"
                                noWrap
                                component="a"
                                href=""
                                sx={{
                                    mr: 2,
                                    ml:1,
                                    display:'flex',
                                    flexGrow: 1,
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                booked
                            </Typography>

                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {/* <AdbIcon sx={{ display:'flex', mr: 1 }} /> */}
                            <img style={{height:'40px'}} src='/assets/booked.png' />
                             
                            {/* <img style={{width:'50px'}} src='/assets/bookends.svg' /> */}

                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                href="/"
                                sx={{
                                    mr: 2,
                                    ml:1,
                                    display:'flex',
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                 booked
                            </Typography>
                            {/* <img style={{width:'24px'}} src='/assets/bookendR.png' /> */}


                            <Box sx={{ color: 'white', flexGrow: 1, display: 'flex' }}>
                                <Button variant="text" color="custom"
                                    onClick={() => navigate('/')}
                                >
                                    Home
                                </Button>
                                <Button variant="text" color="custom"
                                    onClick={() => navigate('/bookcase')}>
                                    Bookcase
                                </Button>
                                <Button variant="text" color="custom"
                                    onClick={() => navigate('/browse')}>
                                    Browse
                                </Button>
                            </Box>
                        </React.Fragment>
                    )}










                    {/* <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Button variant="text" color="custom"
                                    onClick={() => navigate('/')}
                                >
                                    Home
                                </Button>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Button variant="text" color="custom"
                                    onClick={() => navigate('/bookcase')}>
                                    Bookcase
                                </Button>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Button variant="text" color="custom"
                                    onClick={() => navigate('/browse')}>
                                    Browse
                                </Button>
                            </MenuItem>


                        </Menu>
                    </Box> */}











                    {/* FROM HERE DOWN IS INCLUDED ON BOTH --- AVATAR & USER SETTINGS MENU */}
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar>{context.userData.name[0]}</Avatar>
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
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Button variant="text" color="custom">
                                    <ListItemIcon>
                                        <PersonIcon fontSize="small" />
                                    </ListItemIcon>
                                    Profile
                                </Button>
                            </MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Button variant="text" color="custom">
                                    <ListItemIcon>
                                        <PersonAdd fontSize="small" />
                                    </ListItemIcon>
                                    Friends
                                </Button>
                            </MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Button variant="text" color="custom" onClick={() => navigate('/books')}>
                                    <ListItemIcon>
                                        <MenuBookIcon fontSize='small' />
                                    </ListItemIcon>
                                    My Books
                                </Button>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Button variant="text" color="custom">
                                    <ListItemIcon>
                                        <Settings fontSize="small" />
                                    </ListItemIcon>
                                    Settings
                                </Button>
                            </MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Button variant="text" color="custom" onClick={logout}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Logout
                                </Button>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default Navigation;