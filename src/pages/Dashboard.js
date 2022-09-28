//  once logged in -- this is the homepage. Lets you view existing shelves/add new shelves and you can click one to view details about the shelf 
// add book one time from this page and then can add it to as many shelves as you want 

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from "react-router-dom";
import API from '../utils/API';
import AppContext from '../AppContext';
import AddShelf from './components/AddShelf'
import DashStats from './components/DashStats';
import { useTheme } from '@mui/material/styles';
import { List, Container, ListItem, Typography, Box, Card, CardMedia, CardContent, Divider, ListItemText, Button, Stack, useMediaQuery } from '@mui/material';
import ReadingMobile from './components/ReadingMobile';
import OneShelf from './components/OneShelf';
import Carousel from './components/Carousel';

const imageStyle = {
    boxShadow:'3px 2px 6px #888888',
    height:{ xs: 140, md: 218 },
    width: { xs: 95, md: 148 }
}

const cardStyle = {
    maxWidth: { xs: 120, md: 345 },
    backgroundColor: 'transparent',
    boxShadow:0,
}


export default function Dashboard(props) {

    const context = useContext(AppContext);
    let navigate = useNavigate();
    const theme = useTheme();
    const xs = useMediaQuery('(max-width:450px)')
    const smxs = useMediaQuery(theme.breakpoints.down('sm'))
    const md = useMediaQuery(theme.breakpoints.down('md'))
    const middle = useMediaQuery(theme.breakpoints.between('md', 'lg'))

    const [userStats, setUserStats] = useState(null);
    const [activityGoals, setActivityGoals] = useState(null)
    const [currentReads, setCurrentReads] = useState(null);

    const renderCurrentReads = async () => {
        const reads = await API.currentlyReading(context.userData.id)
        setCurrentReads(reads.data)
    }

    const renderShelves = async () => {
        const shelves = await API.getShelves(context.userData.id)
        context.setUserShelves(shelves.data)
    }

    const renderStats = async () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const allStats = await API.allStats(context.userData.id, year, month)
        const activity = await API.currentGoals(context.userData.id)
        setActivityGoals(activity.data)
        setUserStats(allStats.data)
    }

    // on page load, check for token (aka logged in user) and render shelves if logged in. If no token (not logged in) or token can't be verified (user doesn't exist) then redirect to the login page
    useEffect(() => {
        const myToken = localStorage.getItem("token");
        if (myToken) {
            API.verify(myToken).then(async res => {
                context.setToken(myToken)
                context.setUserData({
                    name: res.data.first_name,
                    id: res.data.id,
                    created: res.data.createdAt
                })
                renderCurrentReads()
                renderShelves()
                renderStats()
            }).catch(err => {
                console.log(err)
                localStorage.removeItem("token");
                navigate('/login')
            })
        }
        if (!myToken) {
            navigate('/login')
        }
    }, [])


    return (
        <React.Fragment>

            {smxs ? (
                <Container id='mobile-currently-reading' sx={{ ml: 'auto', mr: 'auto', mt: 5, mb: 5, display: { xs: 'flex' }, flexDirection: 'column' }}>
                    <Typography variant='subtitle2' color='text.secondary'>Currently Reading:</Typography>
                    <Divider />
                    {currentReads && <ReadingMobile currentReads={currentReads} />}
                    <Divider />
                </Container>
            ) : (
                <Container id='currently-reading' sx={{ ml: 'auto', mr: 'auto', mt: 5, mb: 5, display: { md: 'flex' }, flexDirection: 'column', width: 1 / 1 }}>
                    {/* spans whole width of the screen  */}
                    <Typography variant='subtitle1'>Currently Reading:</Typography>
                    <Divider />
                    {currentReads && <Carousel shelf={{id:'CR', Books: currentReads}} />}
                    {/* {currentReads &&
                        <div style={{ display: 'flex', width: '100%', padding: '15px' }}>
                            {currentReads.map((book) => (
                                <Card sx={cardStyle} key={`${book.id}`} className='book-card'>
                                    <CardContent>
                                        <CardMedia
                                            component="img"
                                            sx={imageStyle}
                                            onClick={() => { navigate(`/book/${book.id}`) }}
                                            image={`${book.cover_img}`}
                                            alt={`${book.title}`}
                                        />
                                        <Typography variant='subtitle2' display='block'>{book.title}</Typography>
                                        <Typography variant='caption' display='block'>{book.author}</Typography>
                                    </CardContent>
                                </Card>

                            ))}
                        </div>} */}
                    <Divider />
                </Container>
            )}

            {md ? (
                <Container sx={{ display: { xs: 'flex' }, flexDirection: 'column' }}>
                    {userStats &&
                        <DashStats userStats={userStats} goals={activityGoals} />
                    }
                    <Container sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box id='mobile-quicklinks' sx={{ display: 'flex', justifyContent: 'center', m: 3 }}>
                            <Stack spacing={0} alignItems="center"
                            >
                                {/* quick links sections  */}
                                {/* Link to bookcase, currently reading, all read books, all user books, search for new books  */}
                                <Button onClick={() => navigate('/books/currently')}>Currently Reading</Button>
                                <Button onClick={() => navigate('/activity')}>Reading Activity</Button>
                                <Button onClick={context.toggleShelfDialog}>Add A Shelf</Button>
                            </Stack>
                            <Stack spacing={0} alignItems="center"
                            >
                                <Button onClick={() => navigate('/books/read')}>Read</Button>
                                {/* <Button onClick={() => navigate('/search')}>Find Books</Button> */}
                                <Button onClick={() => navigate('/books')}>All Books</Button>
                                <Button onClick={() => navigate('/shelves')}>My Bookcase</Button>

                            </Stack>
                        </Box>
                        <Box id='mobile-shelves' sx={{ mr: 'auto', ml: 'auto' }}>
                            <Typography variant='subtitle2'>Bookcase Preview</Typography>
                            <Divider />
                            <List sx={{ width: '100%', bgcolor: 'transparent' }}>
                                {context.userShelves.slice(0, 3).map((shelf) => (
                                    <React.Fragment>
                                        {xs ? (
                                            <OneShelf shelf={shelf} length={2} />
                                        ) : (
                                            <OneShelf shelf={shelf} length={3} />
                                        )}

                                        <Divider key={`${shelf.id}dividersm`} />

                                    </React.Fragment>
                                ))}
                            </List>
                        </Box>

                        <Box id='mobile-quicknav' sx={{ m: '5px auto 5px auto', display: 'flex' }}>
                            <Typography variant='h6'>Your Bookcase:</Typography>
                            <Stack spacing={0.5}
                                alignItems="flex-start"
                            >
                                {context.userShelves.map((shelf) => (
                                    <Button
                                        key={`${shelf.id}`}
                                        id={`${shelf.id}`}
                                        onClick={() => navigate(`/shelf/${shelf.id}`)}
                                    >
                                        {shelf.name}</Button>
                                ))}
                            </Stack>
                        </Box>
                    </Container>
                </Container>
            ) : (
                <Container sx={{ display: { md: 'flex' }, flexDirection: 'row-reverse', justifyContent: 'center' }} id='dash'>
                    <Box id='right-column' sx={{ ml: 3, mr: 3 }}>
                        {userStats && <div id='stats'>
                            <DashStats userStats={userStats} goals={activityGoals} />
                        </div>}

                        <div id='quicknav' style={{ display: 'flex', margin: '5px auto 5px auto', justifyContent: 'center' }}>
                            <div id='bookshelf'>
                                {/* List of links to all existing shelves directly */}
                                <Typography variant='h6'>Your Bookcase:</Typography>
                                <Stack spacing={0.5}
                                    alignItems="flex-start"
                                >

                                    {context.userShelves.map((shelf) => (
                                        <Button
                                            key={`${shelf.id}`}
                                            id={`${shelf.id}`}
                                            onClick={() => navigate(`/shelf/${shelf.id}`)}
                                        >
                                            {shelf.name}</Button>
                                    ))}
                                </Stack>
                            </div>

                            <Divider orientation='vertical' />

                            <div id='quicklinks'>
                                <Stack spacing={0} alignItems="flex-end"
                                >
                                    {/* quick links sections  */}
                                    {/* Link to bookcase, currently reading, all read books, all user books, search for new books  */}
                                    <Button onClick={() => navigate('/books/read')}>Read</Button>
                                    <Button onClick={() => navigate('/books')}>All Books</Button>
                                    <Button onClick={() => navigate('/shelves')}>My Bookcase</Button>
                                    <Button onClick={context.toggleShelfDialog}>Add A Shelf</Button>
                                    <Button onClick={() => navigate('/activity')}>Reading Activity</Button>
                                    <Button onClick={() => navigate('/books/currently')}>Currently Reading</Button>
                                    <Button onClick={() => navigate('/books/dnf')}>DNF</Button>
                                    <Button onClick={() => navigate('/books/owned')}>Owned</Button>
                                </Stack>
                            </div>
                        </div>

                    </Box>

                    <Box id='left-column' sx={{ mr: 3 }}>
                        {/* TO DO ON THIS PAGE -- add styling to the shelves; pick a font, add some shadowing to the book cover images, etc.  */}
                        <div id='shelves'>
                            <Typography variant='subtitle2'>Bookcase Preview</Typography>
                            <Divider />
                            <List sx={{ width: '100%', bgcolor: 'transparent' }}>
                                {context.userShelves.slice(0, 3).map((shelf) => (
                                    <React.Fragment>
                                        {middle ? (
                                            <OneShelf shelf={shelf} length={3} />
                                        ) : (
                                            <OneShelf shelf={shelf} length={5} />
                                        )}
                                        <Divider key={`${shelf.id}dividerlg`} />
                                    </React.Fragment>
                                ))}
                            </List>
                        </div>
                    </Box>
                </Container>
            )}

            {context.shelfDialog && <AddShelf />}


        </React.Fragment>
    )




}