//  once logged in -- this is the homepage. Lets you view existing shelves/add new shelves and you can click one to view details about the shelf 
// add book one time from this page and then can add it to as many shelves as you want 

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import API from '../utils/API';
import AppContext from '../AppContext';
import AddShelf from './components/AddShelf'
import DashStats from './components/DashStats';
import SwipeableViews from 'react-swipeable-views';
import { List, Container, ListItem, Typography, Box, Card, CardMedia, CardContent, Divider, ListItemText, Button, Stack, MobileStepper } from '@mui/material';



export default function Dashboard(props) {

    const context = useContext(AppContext);
    let navigate = useNavigate();

    const [userStats, setUserStats] = useState(null);
    const [currentReads, setCurrentReads] = useState(null);
    const [activeStep, setActiveStep] = useState(0)

    const handleChangeIndex = (index) => {
        setActiveStep(index)
    }


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
        setUserStats(allStats.data)
    }

    // on page load, check for token (aka logged in user) and render shelves if logged in. If no token (not logged in) or token can't be verified (user doesn't exist) then redirect to the login page
    useEffect(() => {
        const myToken = localStorage.getItem("token");
        if (myToken) {
            API.verify(myToken).then(async res => {
                context.setToken(myToken)
                context.setUserData({
                    username: res.data.username,
                    id: res.data.id
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


            {/* switch div to MUI component & this will be xs: width full; how to make # of items different for sizes? maybe have current reads div 2x with different spliced indexes for how many books? */}
            <Container id='currently-reading' sx={{ ml: 'auto', mr: 'auto', mt: 5, mb: 5, display: { xs: 'none', md: 'flex' }, flexDirection: 'column' }}>
                {/* spans whole width of the screen  */}
                <Divider />
                <Typography variant='subtitle1'>Currently Reading:</Typography>
                {currentReads &&
                    <div style={{ display: 'flex', width: '100%', padding: '15px' }}>
                        {currentReads.map((book) => (
                            <Card sx={{ maxWidth: { xs: 120, md: 345 } }} key={`${book.id}`} className='book-card'>
                                <CardContent>
                                    <CardMedia
                                        component="img"
                                        sx={{ maxHeight: { xs: 140, md: 218 }, maxWidth: { xs: 95, md: 148 } }}
                                        onClick={() => { navigate(`/book/${book.id}`) }}
                                        image={`${book.cover_img}`}
                                        alt={`${book.title}`}
                                    />
                                    <Typography variant='subtitle2' display='block'>{book.title}</Typography>
                                    <Typography variant='caption' display='block'>{book.author}</Typography>
                                </CardContent>
                            </Card>

                        ))}
                    </div>}
                <Divider />
            </Container>


            <Container id='mobile-currently-reading' sx={{ ml: 'auto', mr: 'auto', mt: 5, mb: 5, display: { md: 'none', xs: 'flex' }, flexDirection: 'column' }}>
                <Typography variant='subtitle2' color='text.secondary'>Currently Reading:</Typography>
                {currentReads && <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 10 }}>
                    <SwipeableViews
                        index={activeStep}
                        onChangeIndex={handleChangeIndex}
                        enableMouseEvents>
                        {currentReads.map((book) => (
                            <Card key={`${book.id}`} className='book-card'>
                                <CardContent sx={{ display: 'flex' }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ maxHeight: { xs: 190, md: 218 }, maxWidth: { xs: 125, md: 148 } }}
                                        onClick={() => { navigate(`/book/${book.id}`) }}
                                        image={`${book.cover_img}`}
                                        alt={`${book.title}`}
                                    />
                                    <Box sx={{ m: 'auto', alignItems: 'center' }}>
                                        <Typography variant='subtitle2' display='block'>{book.title}</Typography>
                                        <Typography variant='caption' display='block'>{book.author}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>

                        ))}
                    </SwipeableViews>
                    <MobileStepper
                        variant="dots"
                        steps={currentReads.length}
                        position="static"
                        activeStep={activeStep}
                        sx={{ flexGrow: 1, bgcolor: 'transparent' }}
                    />
                </Box>
                }

            </Container>

            {/* -----------------------------------------------MOBILE LAYOUT------------------------------------------------------ */}
            <Container sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column' }}>
                {userStats && <div id='stats'>
                    <DashStats userStats={userStats} />
                </div>}
                <Container sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box id='mobile-quicklinks' sx={{ display: 'flex' }}>
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
                    <Box id='mobile-shelves'>
                        <List sx={{ width: '100%', bgcolor: 'transparent' }}>
                            {context.userShelves.slice(0, 3).map((shelf) => (
                                <React.Fragment>
                                    <ListItem key={`${shelf.name}${shelf.id}mobile`} id={`${shelf.name}${shelf.id}mobile`} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <ListItemText
                                            primary={`${shelf.name}`}
                                            sx={{ maxWidth: '10%' }}
                                        />
                                        <div style={{ display: 'flex', width: '100%' }}>

                                            {shelf.Books.slice(0, 2).map((book) => (
                                                <Card sx={{ maxWidth: 345 }} key={`${book.id}`} className='book-card'>
                                                    <CardContent>
                                                        <CardMedia
                                                            component="img"
                                                            height="140"
                                                            onClick={() => { navigate(`/book/${book.id}`) }}
                                                            image={`${book.cover_img}`}
                                                            alt={`${book.title}`}
                                                        />
                                                    </CardContent>
                                                </Card>

                                            ))}
                                        </div>
                                    </ListItem>

                                </React.Fragment>
                            ))}
                        </List>
                    </Box>

                    <Box id='mobile-quicknav' sx={{ m: '5px auto 5px auto', display: 'flex' }}>
                        {/* <div id='mobile-quicklinks'>
                            <Stack spacing={0} alignItems="flex-start"
                            >

                                {/* quick links sections  */}
                                {/* Link to bookcase, currently reading, all read books, all user books, search for new books  */}
                                {/* <Button onClick={context.toggleShelfDialog}>Add A Shelf</Button>
                                <Button onClick={() => navigate('/shelves')}>My Bookcase</Button>
                                <Button onClick={() => navigate('/books/currently')}>Currently Reading</Button>
                                <Button onClick={() => navigate('/books/read')}>Read</Button>
                                <Button onClick={() => navigate('/search')}>Find Books</Button>
                                <Button onClick={() => navigate('/activity')}>Reading Activity</Button>
                                <Button onClick={() => navigate('/books')}>All My Books</Button>
                            </Stack>
                        </div> */}
                        {/* <Divider variant="inset" orientation='vertical' /> */}

                        <div id='mobile-bookshelf'>
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
                    </Box>
                </Container>
            </Container>

            {/* -----------------------------------------------DESKTOP LAYOUT------------------------------------------------------ */}
            <Container sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'row-reverse' }} id='dash'>

                <div id='right-column'>
                    {userStats && <div id='stats'>
                        <DashStats userStats={userStats} />
                    </div>}

                    <div id='quicknav' style={{ display: 'flex', margin: '5px auto 5px auto' }}>
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
                                <Button onClick={context.toggleShelfDialog}>Add A Shelf</Button>
                                <Button onClick={() => navigate('/shelves')}>My Bookcase</Button>
                                <Button onClick={() => navigate('/books/currently')}>Currently Reading</Button>
                                <Button onClick={() => navigate('/books/read')}>Read</Button>
                                <Button onClick={() => navigate('/search')}>Find Books</Button>
                                <Button onClick={() => navigate('/activity')}>Reading Activity</Button>
                                <Button onClick={() => navigate('/books')}>All My Books</Button>
                            </Stack>
                        </div>
                    </div>

                </div>

                <div id='left-column'>
                    {/* TO DO ON THIS PAGE -- add styling to the shelves; pick a font, add some shadowing to the book cover images, etc.  */}
                    <div id='shelves'>
                        <List sx={{ width: '100%', bgcolor: 'transparent' }}>
                            {context.userShelves.slice(0, 3).map((shelf) => (
                                <React.Fragment>
                                    <ListItem key={`${shelf.name}${shelf.id}`} id={`${shelf.name}${shelf.id}`} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <ListItemText
                                            primary={`${shelf.name}`}
                                            sx={{ maxWidth: '10%' }}
                                        />
                                        <div style={{ display: 'flex', width: '100%' }}>

                                            {shelf.Books.map((book) => (
                                                <Card sx={{ maxWidth: 345 }} key={`${shelf.name}${book.id}`} className='book-card'>
                                                    <CardContent>
                                                        <CardMedia
                                                            component="img"
                                                            height="140"
                                                            onClick={() => { navigate(`/book/${book.id}`) }}
                                                            image={`${book.cover_img}`}
                                                            alt={`${book.title}`}
                                                        />
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </ListItem>
                                    <Divider variant="inset" />
                                </React.Fragment>
                            ))}
                        </List>
                    </div>

                    <div id='read-books'>
                        {/* shelf for all books marked as read */}
                    </div>
                </div>
            </Container>


            {context.shelfDialog && <AddShelf />}


        </React.Fragment>
    )




}