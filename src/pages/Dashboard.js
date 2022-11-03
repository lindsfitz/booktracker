
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate  } from "react-router-dom";
import API from '../utils/API';
import AppContext from '../AppContext';
import AddShelf from './components/modals/AddShelf'
import DashStats from './components/DashStats';
import { useTheme } from '@mui/material/styles';
import { List, Container, Typography, Box, Divider, Button, Stack, useMediaQuery } from '@mui/material';
import ReadingMobile from './components/mobile/ReadingMobile';
import OneShelf from './components/OneShelf';
import Carousel from './components/Carousel';
import ReadingProgress from './components/modals/ReadingProgress';

// const imageStyle = {
//     boxShadow:'3px 2px 6px #888888',
//     height:{ xs: 140, md: 218 },
//     width: { xs: 95, md: 148 }
// }

// const cardStyle = {
//     maxWidth: { xs: 120, md: 345 },
//     backgroundColor: 'transparent',
//     boxShadow:0,
// }


export default function Dashboard(props) {

    const context = useContext(AppContext);
    let navigate = useNavigate();
    // let href = useHref()

    const theme = useTheme();
    const xs = useMediaQuery('(max-width:450px)')
    const smxs = useMediaQuery(theme.breakpoints.down('sm'))
    const md = useMediaQuery(theme.breakpoints.down('md'))
    const middle = useMediaQuery(theme.breakpoints.between('md', 'lg'))

    const [userStats, setUserStats] = useState(null);
    const [activityGoals, setActivityGoals] = useState(null)
    const [currentReads, setCurrentReads] = useState(null);
 


    // on page load, check for token (aka logged in user) and render shelves if logged in. If no token (not logged in) or token can't be verified (user doesn't exist) then redirect to the login page
    useEffect(() => {
        const renderCurrentReads = async () => {
            const reads = await API.getReadingList(context.userData.id)
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
    }, [context.token])


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
                <Container id='currently-reading' sx={{ ml: 'auto', mr: 'auto', mt: 5, mb: 5, display: { md: 'flex' }, flexDirection: 'column', width: 5 / 8 }}>
                    {/* spans whole width of the screen  */}
                    <Typography variant='subtitle1'>Currently Reading:</Typography>
                    <Divider />
                    {currentReads && <Carousel shelf={{ id: 'CR', Books: currentReads }} />}

                    <Divider />
                </Container>
            )}

            {md ? (
                <Container sx={{ display: { xs: 'flex' }, flexDirection: 'column', mb:'65px' }}>
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
                                <Button onClick={() => navigate('/books/dnf')}>Did Not Finish</Button>
                                <Button onClick={() => navigate('/books/owned')}>Owned</Button>
                            </Stack>
                            <Stack spacing={0} alignItems="center"
                            >
                                <Button onClick={() => navigate('/books/read')}>Read</Button>
                                {/* <Button onClick={() => navigate('/search')}>Find Books</Button> */}
                                <Button onClick={() => navigate('/books')}>All Books</Button>
                                <Button onClick={() => navigate('/bookcase')}>My Bookcase</Button>

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
                        <Box sx={{ textAlign: 'center', mb:10 }}>
                            <Button variant='outlined' color='success'
                                onClick={() => navigate('/bookcase')}>
                                <Typography variant='caption'>
                                    See All Shelves
                                </Typography>
                            </Button>
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


                         
                                <Stack direction='row' spacing={0} alignItems="flex-end"
                                >
                                    <Stack spacing={0} alignItems="center"
                                    >

                                        <Button onClick={() => navigate('/books/currently')}>Currently Reading</Button>
                                        <Button onClick={() => navigate('/books/dnf')}>Did Not Finish</Button>
                                        <Button onClick={() => navigate('/books/owned')}>Owned</Button>
                                    </Stack>
                                    <Stack spacing={0} alignItems="center"
                                    >
                                        <Button onClick={() => navigate('/books/read')}>Read</Button>
                                        <Button onClick={() => navigate('/books')}>All Books</Button>
                                        <Button onClick={() => navigate('/bookcase')}>My Bookcase</Button>

                                    </Stack>
                                </Stack>

                            
                                <Divider />
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
                            <Box sx={{ textAlign: 'center', mt:3, mb:10 }}>
                                <Button variant='outlined' color='success'
                                    onClick={() => navigate('/bookcase')}>
                                    <Typography variant='caption'>
                                        See All Shelves
                                    </Typography>
                                </Button>
                            </Box>
                        </div>
                    </Box>
                </Container>
            )}

            {context.shelfDialog && <AddShelf />}

            


        </React.Fragment>
    )
}