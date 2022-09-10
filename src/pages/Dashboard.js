//  once logged in -- this is the homepage. Lets you view existing shelves/add new shelves and you can click one to view details about the shelf 
// add book one time from this page and then can add it to as many shelves as you want 

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import API from '../utils/API';
import AppContext from '../AppContext';
import AddShelf from './AddShelf'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ImageListItem from '@mui/material/ImageListItem';
import {Typography, Box, Rating} from '@mui/material';



export default function Dashboard(props) {

    const context = useContext(AppContext);
    let navigate = useNavigate();


    // const [userShelves, setUserShelves] = useState([])

    const [userStats,setUserStats] = useState(null)
    const [thisYear,setThisYear] = useState(2022);
    const [thisMonth,setThisMonth] = useState(7)


    const renderShelves = async () => {
        const shelves = await API.getShelves(context.userData.id)
        context.setUserShelves(shelves.data)
    }

    const renderStats = async () => {
        const readStats = await API.allReadStats(context.userData.id);
        const shelfStats = await API.allShelfStats(context.userData.id);
        const yearlyStats = await API.yearlyStats(thisYear, context.userData.id);
        const monthlyStats = await API.monthlyStats(thisMonth,context.userData.id)

        // console.log(readStats.data[0].Reviews.avgRating)

        setUserStats({
            read: readStats.data[0],
            shelf: shelfStats.data[0],
            year: yearlyStats.data[0],
            month: monthlyStats.data[0]
        })
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
                console.log(userStats)
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


    // useEffect(() => {
    //     console.log(userShelves)

    // }, [userShelves])



    return (
        <React.Fragment>
            {/* ONE LIST COMPONENT ALREADY EXISTS PRE DATA PULL */}
            {/* ***** ONCE DATA IS BEING PULLED VIA API SUCCESSFULLY - MAP OVER SHELF RESULTS. CREATE LIST ITEM COMPONENT FOR EACH SHELF IN RESULTS DATA & LIST ITEM TEXT FOR THE TITLE OF EACH SHELF */}
            {/* *** ONE IMAGE LIST ITEM IS CREATED FOR EACH BOOK INSIDE OF THE SHELF. JUST SET THE SRC TO THE IMAGE LINK FROM THE RESULTS */}
            {userStats && <div id='stats'>
                {/* All-Time Stats */}
                <Box sx={{width:'30%', margin:'10px', padding:'5px', backgroundColor:'#e5c7ad', borderRadius:'10px'}}>
                    <Typography variant='h6'>All-Time</Typography>
                    <Typography variant='subtitle1'>Total Books Read: {userStats.read.bookCount}</Typography>
                    <Typography variant='subtitle1'>Total Pages Read: {userStats.read.totalPages}</Typography>
                    <Typography variant='subtitle1'>Average Rating: <Rating name="half-rating-read" defaultValue={userStats.read.avgRating} precision={0.5} readOnly /></Typography>
                </Box>
                {/* This Year's Stats */}
                <Box sx={{width:'30%', margin:'10px', padding:'5px'}}>
                    <Typography variant='h6'>So Far in {thisYear}</Typography>
                    <Typography variant='subtitle1'>Total Books Read: {userStats.year.bookCount}</Typography>
                    <Typography variant='subtitle1'>Total Pages Read: {userStats.year.totalPages}</Typography>
                    <Typography variant='subtitle1'>Average Rating: <Rating name="half-rating-read" defaultValue={4.5} precision={0.5} readOnly /></Typography>
                </Box>
                {/* This MONTH's Stats */}
                <Box sx={{width:'30%', margin:'10px', padding:'5px'}}>
                    <Typography variant='h6'>So Far in {thisMonth}</Typography>
                    <Typography variant='subtitle1'>Total Books Read: {userStats.month.bookCount}</Typography>
                    <Typography variant='subtitle1'>Total Pages Read: {userStats.month.totalPages}</Typography>
                    <Typography variant='subtitle1'>Average Rating: <Rating name="half-rating-read" defaultValue={4.5} precision={0.5} readOnly /></Typography>
                </Box>
            </div>}
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
                                        <ImageListItem key={book.title} sx={{ maxHeight: 218, maxWidth: 148, margin: 2 }}>
                                            <img
                                                src={`${book.cover_img}`}
                                                srcSet={`${book.cover_img}`}
                                                alt={`${book.title}`}
                                                loading="lazy"

                                            />
                                        </ImageListItem>

                                    ))}
                                </div>
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    ))}
                </List>
            </div>


            {context.shelfDialog && <AddShelf />}


        </React.Fragment>
    )




}