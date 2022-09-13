//  once logged in -- this is the homepage. Lets you view existing shelves/add new shelves and you can click one to view details about the shelf 
// add book one time from this page and then can add it to as many shelves as you want 

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import API from '../utils/API';
import AppContext from '../AppContext';
import AddShelf from './AddShelf'
import PropTypes from 'prop-types';
import { List, ListItem, Typography, Box, Rating, Tabs, Tab, Card, CardMedia, CardContent, Divider, ListItemText, Button, Stack } from '@mui/material';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]



export default function Dashboard(props) {

    const context = useContext(AppContext);
    let navigate = useNavigate();


    // const [userShelves, setUserShelves] = useState([])

    const [userStats, setUserStats] = useState(null)
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const renderShelves = async () => {
        const shelves = await API.getShelves(context.userData.id)
        context.setUserShelves(shelves.data)
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    const renderStats = async () => {
        const allStats = await API.allStats(context.userData.id, year, month)

        setUserStats({
            read: allStats.data[0],
            shelf: allStats.data[1],
            year: allStats.data[2],
            month: allStats.data[3]
        })
        // const readStats = await API.allReadStats(context.userData.id);
        // const shelfStats = await API.allShelfStats(context.userData.id);
        // const yearlyStats = await API.yearlyStats(year, context.userData.id);
        // const monthlyStats = await API.monthlyStats(month, context.userData.id)
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
            {/* ONE LIST COMPONENT ALREADY EXISTS PRE DATA PULL */}
            {/* ***** ONCE DATA IS BEING PULLED VIA API SUCCESSFULLY - MAP OVER SHELF RESULTS. CREATE LIST ITEM COMPONENT FOR EACH SHELF IN RESULTS DATA & LIST ITEM TEXT FOR THE TITLE OF EACH SHELF */}
            {/* *** ONE IMAGE LIST ITEM IS CREATED FOR EACH BOOK INSIDE OF THE SHELF. JUST SET THE SRC TO THE IMAGE LINK FROM THE RESULTS */}


            <div id='currently-reading'>
                    {/* spans whole width of the screen  */}

            </div>


            <div id='dash'>

                <div id='right-column'>
                    {/* Add tabs here for the stats on mobile -- leave as flexbox boxes on desktop */}
                    {userStats && <div id='stats'>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="stats tabs">
                                    <Tab label="This Month" {...a11yProps(0)} />
                                    <Tab label="This Year" {...a11yProps(1)} />
                                    <Tab label="All-Time" {...a11yProps(2)} />
                                    <Tab label="All Shelves" {...a11yProps(3)} />

                                </Tabs>
                            </Box>
                            {/* THIS MONTH Stats */}
                            <TabPanel value={value} index={0}>
                                {/* <Box sx={{ margin: '10px', padding: '5px' }}> */}
                                    <Typography variant='h6'>So Far in {months[month]}</Typography>
                                    <Typography variant='subtitle1'>Total Books Read: {userStats.month.bookCount}</Typography>
                                    <Typography variant='subtitle1'>Total Pages Read: {userStats.month.totalPages}</Typography>
                                    <Typography variant='subtitle1'>Average Rating: <Rating name="half-rating-read" defaultValue={parseInt(userStats.month.avgRating)} precision={0.5} readOnly /></Typography>
                                {/* </Box> */}
                            </TabPanel>
                            {/* This Year's Stats */}
                            <TabPanel value={value} index={1}>

                                {/* <Box sx={{ margin: '10px', padding: '5px' }}> */}
                                    <Typography variant='h6'>So Far in {year}</Typography>
                                    <Typography variant='subtitle1'>Total Books Read: {userStats.year.bookCount}</Typography>
                                    <Typography variant='subtitle1'>Total Pages Read: {userStats.year.totalPages}</Typography>
                                    <Typography variant='subtitle1'>Average Rating: <Rating name="half-rating-read" defaultValue={parseInt(userStats.year.avgRating)} precision={0.5} readOnly /></Typography>
                                {/* </Box> */}
                            </TabPanel>
                            {/* ALL TIME Stats */}
                            <TabPanel value={value} index={2}>
                                {/* <Box sx={{ margin: '10px', padding: '5px', borderRadius: '10px' }}> */}
                                    <Typography variant='h6'>All-Time</Typography>
                                    <Typography variant='subtitle1'>Total Books Read: {userStats.read.bookCount}</Typography>
                                    <Typography variant='subtitle1'>Total Pages Read: {userStats.read.totalPages}</Typography>
                                    <Typography variant='subtitle1'>Average Rating: <Rating name="half-rating-read" defaultValue={parseInt(userStats.read.avgRating)} precision={0.5} readOnly /></Typography>
                                {/* </Box> */}
                            </TabPanel>
                            {/* ALL SHELVED BOOKS */}
                            <TabPanel value={value} index={3}>
                                {/* <Box sx={{ margin: '10px', padding: '5px', borderRadius: '10px' }}> */}
                                    <Typography variant='h6'>Currently Shelved Books</Typography>
                                    <Typography variant='subtitle1'>Total Bookcase Books: {userStats.shelf.bookCount}</Typography>
                                    <Typography variant='subtitle1'>Total Shelved Pages: {userStats.shelf.totalPages}</Typography>
                                {/* </Box> */}
                            </TabPanel>
                        </Box>
                    </div>}

                    <div id='bookshelf'>
                        {/* List of links to all existing shelves directly */}
                        <Typography variant='h6'>Your Bookshelf</Typography>
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

                    <div id='links'>
                        {/* quick links sections  */}
                    </div>

                </div>



                <div id='left-column'>
                    {/* TO DO ON THIS PAGE -- add styling to the shelves; pick a font, add some shadowing to the book cover images, etc.  */}
                    <div id='shelves'>
                        <List sx={{ width: '100%', bgcolor: 'transparent' }}>
                            {context.userShelves.slice(0, 3).map((shelf) => (
                                <React.Fragment>
                                    <ListItem key={`${shelf.id}`} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <ListItemText
                                            primary={`${shelf.name}`}
                                            sx={{ maxWidth: '10%' }}
                                        />
                                        <div style={{ display: 'flex', width: '100%' }}>

                                            {shelf.Books.map((book) => (
                                                // <ImageListItem key={book.title} sx={{ maxHeight: 218, maxWidth: 148, margin: 2 }}>
                                                //     <img
                                                //         src={`${book.cover_img}`}
                                                //         srcSet={`${book.cover_img}`}
                                                //         alt={`${book.title}`}
                                                //         loading="lazy"

                                                //     />
                                                // </ImageListItem>
                                                <Card sx={{ maxWidth: 345 }} key={`${book.title}`}>
                                                    <CardContent>

                                                        <CardMedia
                                                            component="img"
                                                            height="140"
                                                            image={`${book.cover_img}`}
                                                            alt={`${book.title}`}
                                                        />
                                                    </CardContent>
                                                </Card>

                                            ))}
                                        </div>
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                            ))}
                        </List>
                    </div>

                    <div id='read-books'>
                        {/* shelf for all books marked as read */}
                    </div>
                </div>
            </div>


            {context.shelfDialog && <AddShelf />}


        </React.Fragment>
    )




}