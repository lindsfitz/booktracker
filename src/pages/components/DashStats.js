import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { Typography, Box, Rating, Tabs, Tab, Divider, Button } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

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
                    <Typography component='div'>{children}</Typography>
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


export default function DashStats({ userStats }) {
    let navigate = useNavigate();

    const [value, setValue] = useState(0);
    const [year, setYear] = useState(null)
    const [month, setMonth] = useState(null)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = index => {
        setValue(index)
    }

    useEffect(() => {
        const date = new Date();
        setYear(date.getFullYear())
        setMonth(date.getMonth())
    }, [])

    return (
        <React.Fragment>
            <Box id='stats' sx={{ width: '100%', mr:'auto',ml:'auto' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        // variant="scrollable"
                        // scrollButtons="auto"
                        centered
                        
                        aria-label="stats tabs"
                        >
                        <Tab label="This Month" {...a11yProps(0)} />
                        <Tab label="This Year" {...a11yProps(1)} />
                        <Tab label="All-Time" {...a11yProps(2)} />
                        <Tab label="All Shelves" {...a11yProps(3)} />
                        
                    </Tabs>
                </Box>

                {/* THIS MONTH Stats */}
                <SwipeableViews 
                index={value} 
                onChangeIndex={handleChangeIndex}
                enableMouseEvents
                style={{marginLeft:'auto', marginRight:'auto', textAlign:'center'}}>
                    <TabPanel value={value} index={0} >
                        <Typography variant='h6'>So Far in {months[month]}</Typography>
                        {userStats.month ? (
                            <div>
                                <Typography variant='subtitle1'>Total Books Read: {userStats.month.bookCount}</Typography>
                                <Typography variant='subtitle1'>Total Pages Read: {userStats.month.totalPages}</Typography>
                                <Typography variant='subtitle1'>Average Rating: <Rating name="half-rating-read" defaultValue={parseInt(userStats.month.avgRating)} precision={0.5} readOnly /></Typography>
                            </div>
                        ) : (
                            <div>
                                <Typography variant='subtitle1'>You haven't marked any books as read so far this month.</Typography>
                            </div>
                        )}
                       
                            <Button onClick={()=>navigate('/activity')}>View All Activity</Button>
                      
                    </TabPanel>

                    {/* This Year's Stats */}
                    <TabPanel value={value} index={1} component="div">
                        <Typography variant='h6'>So Far in {year}</Typography>
                        {userStats.year ? (
                            <div>
                                <Typography variant='subtitle1'>Total Books Read: {userStats.year.bookCount}</Typography>
                                <Typography variant='subtitle1'>Total Pages Read: {userStats.year.totalPages}</Typography>
                                <Typography variant='subtitle1'>Average Rating: <Rating name="half-rating-read" defaultValue={parseInt(userStats.year.avgRating)} precision={0.5} readOnly /></Typography>
                            </div>
                        ) : (
                            <div>
                                <Typography variant='subtitle1'>You haven't marked any books as read so far this year.</Typography>
                            </div>
                        )}
                        <Button onClick={()=>navigate('/activity')}>View All Activity</Button>
                    </TabPanel>

                    {/* ALL TIME Stats */}
                    <TabPanel value={value} index={2} component="div">
                        <Typography variant='h6'>All-Time</Typography>
                        {userStats.all ? (
                            <div>
                                <Typography variant='subtitle1'>Total Books Read: {userStats.all.bookCount}</Typography>
                                <Typography variant='subtitle1'>Total Pages Read: {userStats.all.totalPages}</Typography>
                                <Typography variant='subtitle1'>Average Rating: <Rating name="half-rating-read" defaultValue={parseInt(userStats.all.avgRating)} precision={0.5} readOnly /></Typography>
                            </div>
                        ) : (
                            <div>
                                <Typography variant='subtitle1'>You haven't marked any books as read on this account yet.</Typography>
                            </div>
                        )}
                         <Button onClick={()=>navigate('/books/read')}>Marked As Read</Button>
                    </TabPanel>

                    {/* ALL SHELVED BOOKS */}
                    <TabPanel value={value} index={3} component="div">
                        <Typography variant='h6'>Currently Shelved Books</Typography>
                        {userStats.shelved ? (
                            <div>
                                <Typography variant='subtitle1'>Total Bookcase Books: {userStats.shelved.bookCount}</Typography>
                                <Typography variant='subtitle1'>Total Shelved Pages: {userStats.shelved.totalPages}</Typography>
                            </div>
                        ) : (
                            <div>
                                <Typography variant='subtitle1'>You don't have any books in your Bookcase yet.</Typography>
                            </div>
                        )}
                         <Button onClick={()=>navigate('/books')}>View Your Books</Button>
                    </TabPanel>
                </SwipeableViews>
                <Divider />
            </Box>
        </React.Fragment>
    )
}