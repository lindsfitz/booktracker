// login/signup for an account via this page 

import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import API from '../utils/API';
import AppContext from '../AppContext';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function Login() {
    let navigate = useNavigate();
    const context = useContext(AppContext);

    const [signup, setSignup] = useState(false)

    const toggleForm = () => {
        setSignup(!signup)
    }


    const handleLogin = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const user = {
            email: data.get('loginEmail'),
            password: data.get('loginPassword'),
        }

        API.login(user).then(async (res) => {
            console.log(res.data)
            localStorage.setItem("token", res.data.token)
            context.setUserData({
                id: res.data.user.id,
                username: res.data.user.username
            })
            context.setToken(res.data.token)
            navigate('/');
        })

    };

    const handleSignup = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const newUser = {
            email: data.get('signupEmail'),
            password: data.get('signupPassword'),
            username: data.get('username')
        };
        API.signup(newUser).then(res => {
            console.log(res)
            API.login(newUser).then(async res => {
                localStorage.setItem("token", res.data.token)
                context.setUserData({
                    id: res.data.user.id,
                    username: res.data.user.username
                })
                context.setToken(res.data.token)
                navigate('/');
            }).catch(err => {
                alert("Signup Failed")
                console.log(err);
            })
        })
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                {!signup && <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Log In
                    </Typography>
                    <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="loginEmail"
                            label="Email Address"
                            name="loginEmail"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="loginPassword"
                            label="Password"
                            type="password"
                            id="loginPassword"
                            autoComplete="current-password"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link onClick={toggleForm} variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>}

                {signup &&
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSignup} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                {/* <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="signupFirst"
                                        required
                                        fullWidth
                                        id="signupFirst"
                                        label="First Name"
                                        autoFocus
                                    />
                                </Grid> */}
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="signupEmail"
                                        label="Email Address"
                                        name="signupEmail"
                                        autoComplete="email"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        autoComplete="username"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="signupPassword"
                                        label="Password"
                                        type="password"
                                        id="signupPassword"
                                        autoComplete="new-password"
                                    />
                                </Grid>

                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link onClick={toggleForm} variant="body2">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                }
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}