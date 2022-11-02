import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import AppContext from '../../AppContext';
import dayjs from 'dayjs'
import PropTypes from 'prop-types';
import { Typography, Box, Rating, Tabs, Tab, Divider, Button, CircularProgress, Stack, Link } from '@mui/material';
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

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="text.secondary">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

export default function DashStats({ userStats, goals }) {
    const context = useContext(AppContext);
    let navigate = useNavigate();

    const [value, setValue] = useState(0);
    const [year, setYear] = useState(null)
    const [month, setMonth] = useState(null)
    const [monthProgress, setMonthProgress] = useState(0);
    const [yearProgress, setYearProgress] = useState(0);

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
        if (userStats.month && goals.month) { setMonthProgress((userStats.month.bookCount / goals.month.value * 100)) }
        if (userStats.year && goals.year) { setYearProgress((userStats.year.bookCount / goals.year.value * 100)) }
    }, [userStats, goals])

    return (
        <React.Fragment>
            <Box id='stats' sx={{ width: '100%', mr: 'auto', ml: 'auto' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        // variant="scrollable"
                        // scrollButtons="auto"
                        centered

                        aria-label="stats tabs"
                    >
                        <Tab label="Month" {...a11yProps(0)} />
                        <Tab label="Year" {...a11yProps(1)} />
                        <Tab label="All-Time" {...a11yProps(2)} />
                        <Tab label="Shelved" {...a11yProps(3)} />

                    </Tabs>
                </Box>

                {/* THIS MONTH Stats */}
                <SwipeableViews
                    index={value}
                    onChangeIndex={handleChangeIndex}
                    enableMouseEvents
                    style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
                    <TabPanel value={value} index={0} >
                        <Typography variant='h6'>{months[month]}</Typography>
                        <Typography variant='subtitle1'>Reading Activity</Typography>

                        {userStats.month ? (
                            <div>
                                {goals.month ? (
                                    <React.Fragment>
                                        <CircularProgressWithLabel value={monthProgress} />
                                        <Typography variant='subtitle2'>You have read {userStats.month.bookCount} of {goals.month.value} books this month.</Typography>
                                    </React.Fragment>
                                ) : (
                                    <Typography variant='subtitle2'>You have read {userStats.month.bookCount} books this month.</Typography>
                                )}

                                <Typography variant='subtitle2'>That adds up to {userStats.month.totalPages} pages so far.</Typography>
                                <Typography variant='subtitle2'>On average, you gave books </Typography>
                                <Stack direction='row' spacing={1} justifyContent='center'>
                                    <Rating name="half-rating-read" defaultValue={parseInt(userStats.month.avgRating)} precision={0.5} readOnly size="small" />
                                    <Typography>stars.</Typography>
                                </Stack>
                            </div>
                        ) : (
                            <div>
                                <Typography variant='subtitle1'>You haven't marked any books as read so far this month.</Typography>
                            </div>
                        )}

                        {/* {goals.month ? <Link href="#" underline="hover" variant='caption'>
                            update activity goal
                        </Link> : <Link href="#" underline="hover" variant='caption'>
                            add an activity goal
                        </Link>} */}
                        <br />

                        <Button onClick={() => navigate('/activity')}>View All Activity</Button>

                    </TabPanel>

                    {/* This Year's Stats */}
                    <TabPanel value={value} index={1} component="div">
                        <Typography variant='h6'>{year}</Typography>
                        <Typography variant='subtitle1'>Reading Activity</Typography>
                        {userStats.year ? (
                            <div>
                                {goals.year ? (
                                    <React.Fragment>
                                        <CircularProgressWithLabel value={yearProgress} />
                                        <Typography variant='subtitle2'>You have finished {userStats.year.bookCount} of {goals.year.value} books this year.</Typography>
                                    </React.Fragment>
                                ) : (
                                    <Typography variant='subtitle2'>You have finished {userStats.year.bookCount} books this year.</Typography>
                                )}
                                <Typography variant='subtitle2'>That adds up to {userStats.year.totalPages} pages so far</Typography>
                                <Typography variant='subtitle2'>On average, you gave books </Typography>
                                <Stack direction='row' spacing={1} justifyContent='center'>
                                    <Rating name="half-rating-read" defaultValue={parseInt(userStats.year.avgRating)} precision={0.5} readOnly size="small" />
                                    <Typography>stars.</Typography>
                                </Stack>
                            </div>
                        ) : (
                            <div>
                                <Typography variant='subtitle1'>You haven't marked any books as read so far this year.</Typography>
                            </div>
                        )}

                        {/* {goals.year ? <Link href="#" underline="hover" variant='caption'>
                            update activity goal
                        </Link> : <Link href="#" underline="hover" variant='caption'>
                            add an activity goal
                        </Link>} */}
                        <br />
                        <Button onClick={() => navigate('/activity')}>View All Activity</Button>
                    </TabPanel>

                    {/* ALL TIME Stats */}
                    <TabPanel value={value} index={2} component="div">
                        <Typography variant='h6'>All-Time</Typography>
                        <Typography variant='subtitle1'>Reading Activity</Typography>

                        {userStats.all ? (
                            <div>
                                <Typography variant='subtitle2'>You have been a member since {dayjs(context.userData.created).format('MMM D, YYYY')}</Typography>
                                <Typography variant='subtitle2'>Since then, you've marked {userStats.all.bookCount} book(s) as read.</Typography>
                                <Typography variant='subtitle2'>That adds up to {userStats.all.totalPages} pages so far.</Typography>
                                <Typography variant='subtitle2'>On average, you gave books </Typography>
                                <Stack direction='row' spacing={1} justifyContent='center'>
                                    <Rating name="half-rating-read" defaultValue={parseInt(userStats.all.avgRating)} precision={0.5} readOnly size="small" />
                                    <Typography>stars.</Typography>
                                </Stack>
                            </div>
                        ) : (
                            <div>
                                <Typography variant='subtitle1'>You haven't marked any books as read on this account yet.</Typography>
                            </div>
                        )}
                        <Button onClick={() => navigate('/books/read')}>Marked As Read</Button>
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
                        <Button onClick={() => navigate('/books')}>View Your Books</Button>
                    </TabPanel>
                </SwipeableViews>
                <Divider />
            </Box>
        </React.Fragment>
    )
}