import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import API from '../utils/API';
import AppContext from '../AppContext';
import SwipeableViews from 'react-swipeable-views';
import PropTypes from 'prop-types';
import dayjs from 'dayjs'
import { useTheme } from '@mui/material/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { List, Container, ListItem, Typography, Box, Rating, Card, CardMedia, Divider, Button, Stack, useMediaQuery, Tabs, Tab, IconButton } from '@mui/material';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
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

// function a11yProps(index) {
//     return {
//         id: `full-width-tab-${index}`,
//         'aria-controls': `full-width-tabpanel-${index}`,
//     };
// }

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export default function ReadingActivity() {
    const context = useContext(AppContext);
    let navigate = useNavigate();
    const theme = useTheme();
    const xs = useMediaQuery('(max-width:450px)')
    const smxs = useMediaQuery(theme.breakpoints.down('sm'))

    const [value, setValue] = useState(0);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);
    const [monthlyBooks, setMonthlyBooks] = useState(null);
    const [yearlyBooks, setYearlyBooks] = useState(null);
    const [stats, setStats] = useState(null)


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const nextMonth = () => {
        setMonth(month => month + 1)

    }

    const prevMonth = () => {
        setMonth(month => month - 1)
    }

    const nextYear = () => {
        setYear(year => year + 1)
    }

    const prevYear = () => {
        setYear(year => year - 1)
    }


    const monthlyStats = async (month) => {
        const monthBooks = await API.monthlyBooks(month, context.userData.id)
        setMonthlyBooks(monthBooks.data)
    }

    const yearlyStats = async (year) => {
        const yearBooks = await API.yearlyBooks(year, context.userData.id)
        setYearlyBooks(yearBooks.data)
    }

    const loadStats = async (year, month) => {
        const allStats = await API.allStats(context.userData.id, year, month)
        setStats(allStats.data)
    }

    const date = new Date();
    const thismonth = date.getMonth()
    const thisyear = date.getFullYear()

    useEffect(() => {
        setMonth(thismonth)
        setYear(thisyear)
    }, [])

    useEffect(() => {
        monthlyStats(month);
        yearlyStats(year);
        loadStats(year, month)
    }, [month, year])

    return (
        <React.Fragment>
            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <Tabs value={value} onChange={handleChange} centered>
                    <Tab label="Monthly Reading Activity" />
                    <Tab label="Yearly Reading Activity" />
                </Tabs>
            </Box>
            <SwipeableViews
                index={value}
                onChangeIndex={handleChangeIndex}
                enableMouseEvents
                style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>

                    {/* month panel */}
                <TabPanel value={value} index={0} >
                    {stats && <Container>
                            <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', p:3}}>
                                <Stack direction='row' spacing={5}>
                                    <IconButton size="small" onClick={prevMonth} disabled={month === 0}>
                                        <NavigateBeforeIcon /></IconButton>
                                    <Typography variant='h6'>Your {months[month]} Activity</Typography>
                                    <IconButton size="small"
                                        onClick={nextMonth}
                                        disabled={month === thismonth}>
                                        <NavigateNextIcon /></IconButton>
                                </Stack>
                                {stats.month ? (
                                    <div>
                                        <Typography variant='subtitle1'>Total Books Read: {stats.month.bookCount}</Typography>
                                        <Typography variant='subtitle1'>Total Pages Read: {stats.month.totalPages}</Typography>
                                        <Typography variant='subtitle1'>Average Rating: <Rating name="half-rating-read" defaultValue={parseInt(stats.month.avgRating)} precision={0.5} readOnly /></Typography>
                                    </div>
                                ) : (
                                    <div>
                                       { month === thismonth ? <Typography variant='subtitle1'>You haven't marked any books as read so far this month.</Typography> : <Typography variant='subtitle1'>You didn't mark any books as read in {months[month]}.</Typography>}
                                    </div>
                                )}
                            </Box>
                          
                            <Divider />
                        </Container>
                    }

                    {monthlyBooks && <Container sx={{ width: { xs: 1 / 1, md: 4 / 5 }, mr: 'auto', ml: 'auto' }}>
                        <List sx={{ bgcolor: 'background.paper' }}>
                            {monthlyBooks.map((book) => (<React.Fragment>
                                <ListItem key={`${book.title}${book.id}month`} alignItems="flex-start" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Card sx={{ height: { xs: 145, md: 218 }, width: { xs: 100, md: 148 } }}>
                                            <CardMedia
                                                component='img'
                                                onClick={() => { navigate(`/book/${book.id}`) }}
                                                image={`${book.cover_img}`}
                                                alt={`${book.title}`}
                                                sx={{ height: { xs: 140, md: 218 }, width: { xs: 95, md: 148 } }}
                                            />
                                        </Card>
                                        <Box>
                                            <Typography variant='subtitle2'>{book.title}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {book.author}
                                            </Typography>
                                            <Button onClick={() => { navigate(`/book/${book.id}`) }}>Book Details</Button>
                                        </Box>
                                    </Box>

                                    <Divider orientation='vertical' variant="inset" />

                                    <Box>
                                        <Typography variant='subtitle1'>You Rated It <Rating name="half-rating-read" defaultValue={parseInt(book.Reviews[0].rating)} precision={0.5} readOnly /></Typography>
                                        <Typography variant='subtitle1'>Total Pages Read: {book.pages}</Typography>
                                        <Typography variant='caption'>Read From: {dayjs(book.Reviews[0].date_started).format('MMM D, YYYY')} - {dayjs(book.Reviews[0].date_finished).format('MMM D, YYYY')}</Typography>
                                    </Box>


                                </ListItem>
                                <Divider key={`monthdivider${book.id}`} component="li" />

                            </React.Fragment>))}

                        </List>
                    </Container>}
                </TabPanel>

                    {/* year panel */}
                <TabPanel value={value} index={1} >
                    {stats && <Container>
                        <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', p:3}}>
                            <Stack direction='row' spacing={5}>
                                <IconButton size="small" onClick={prevYear} disabled={year === thisyear-2}>
                                    <NavigateBeforeIcon /></IconButton>

                                <Typography variant='h6'>Your {year} Activity</Typography>
                                <IconButton size="small"
                                    onClick={nextYear}
                                    disabled={year === thisyear}>
                                    <NavigateNextIcon /></IconButton>
                            </Stack>
                            {stats.year ? (
                                <div>
                                    <Typography variant='subtitle1'>Total Books Read: {stats.year.bookCount}</Typography>
                                    <Typography variant='subtitle1'>Total Pages Read: {stats.year.totalPages}</Typography>
                                    <Typography variant='subtitle1'>Average Rating: <Rating name="half-rating-read" defaultValue={parseInt(stats.year.avgRating)} precision={0.5} readOnly /></Typography>
                                </div>
                            ) : (
                                <div>
                                    {year === thisyear ? <Typography variant='subtitle1'>You haven't marked any books as read so far this year.</Typography> : <Typography variant='subtitle1'>You didn't mark any books as read in {year}.</Typography>}
                                </div>
                            )}
                        </Box>
                   
                        <Divider />
                    </Container>}


                    {yearlyBooks && <Container sx={{ width: { xs: 1 / 1, md: 4 / 5 }, mr: 'auto', ml: 'auto' }}>
                        <List sx={{ bgcolor: 'background.paper' }}>
                            {yearlyBooks.map((book) => (<React.Fragment>
                                <ListItem key={`${book.title}${book.id}month`} alignItems="flex-start" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Card sx={{ height: { xs: 145, md: 218 }, width: { xs: 100, md: 148 } }}>
                                            <CardMedia
                                                component='img'
                                                onClick={() => { navigate(`/book/${book.id}`) }}
                                                image={`${book.cover_img}`}
                                                alt={`${book.title}`}
                                                sx={{ height: { xs: 140, md: 218 }, width: { xs: 95, md: 148 } }}
                                            />
                                        </Card>
                                        <Box>
                                            <Typography variant='subtitle2'>{book.title}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {book.author}
                                            </Typography>
                                            <Button onClick={() => { navigate(`/book/${book.id}`) }}>Book Details</Button>
                                        </Box>
                                    </Box>

                                    <Divider orientation='vertical' variant="inset" />

                                    <Box>
                                        <Typography variant='subtitle1'>You Rated It <Rating name="half-rating-read" defaultValue={parseInt(book.Reviews[0].rating)} precision={0.5} readOnly /></Typography>
                                        <Typography variant='subtitle1'>Total Pages Read: {book.pages}</Typography>
                                        <Typography variant='caption'>Read From: {dayjs(book.Reviews[0].date_started).format('MMM D, YYYY')} - {dayjs(book.Reviews[0].date_finished).format('MMM D, YYYY')}</Typography>
                                    </Box>


                                </ListItem>
                                <Divider key={`yeardivider${book.id}`} component='li' />

                            </React.Fragment>))}

                        </List>
                    </Container>}
                </TabPanel>
            </SwipeableViews>
        </React.Fragment>
    )
}
