import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import API from '../utils/API';
import AppContext from '../AppContext';
import AddGoal from './components/modals/AddGoal';
import EditGoal from './components/modals/EditGoal';
import SwipeableViews from 'react-swipeable-views';
import PropTypes from 'prop-types';
import dayjs from 'dayjs'
import { useTheme } from '@mui/material/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { List, Container, ListItem, Typography, Box, Rating, Card, CardMedia, Divider, Button, Stack, Tabs, Tab, IconButton } from '@mui/material';
import MonthlyStats from './components/Activity/MonthlyStats';
import YearlyStats from './components/Activity/YearlyStats';


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



const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export default function ReadingActivity() {
    const context = useContext(AppContext);
    let navigate = useNavigate();
    const theme = useTheme();
    // const xs = useMediaQuery('(max-width:450px)')
    // const smxs = useMediaQuery(theme.breakpoints.down('sm'))

    const [value, setValue] = useState(0);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);
    const [monthlyBooks, setMonthlyBooks] = useState(null);
    const [yearlyBooks, setYearlyBooks] = useState(null);
    const [monthlyGoal, setMonthlyGoal] = useState(null);
    const [yearlyGoal, setYearlyGoal] = useState(null);
    const [monthProgress, setMonthProgress] = useState(null);
    const [yearProgress, setYearProgress] = useState(null);
    const [stats, setStats] = useState(null)
    const [addGoal, setAddGoal] = useState(false)
    const [editGoal, setEditGoal] = useState(false)
    const [action, setAction] = useState(null)


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

    const newGoal = (action) => {
        setAction(action)
        setAddGoal(true)
    }

    const updateGoal = (action) => {
        setAction(action)
        setEditGoal(true)
    }

    const date = new Date();
    const thismonth = date.getMonth()
    const thisyear = date.getFullYear()

    useEffect(() => {
        setMonth(thismonth)
        setYear(thisyear)
    }, [thismonth, thisyear])

    useEffect(() => {

        const readingActivity = async (month, year) => {
            const yearBooks = await API.yearlyBooks(year, context.userData.id)
            const monthBooks = await API.monthlyBooks(month, context.userData.id)
            const allStats = await API.allStats(context.userData.id, year, month)
            const monthGoals = await API.monthlyGoal(month, context.userData.id)
            const yearGoals = await API.yearlyGoal(year, context.userData.id)
            // console.log(yearBooks)
            setMonthlyBooks(monthBooks.data)
            setYearlyBooks(yearBooks.data)
            setStats(allStats.data)
            // console.log(stats)
            monthGoals.data ? setMonthlyGoal(monthGoals.data.value) : setMonthlyGoal(null)
            yearGoals.data ? setYearlyGoal(yearGoals.data.value) : setYearlyGoal(null)
        }

        readingActivity(month, year)
    }, [month, year, context.userData])

    useEffect(() => {

        const getProgress = async () => {
            if (stats.month && monthlyGoal) {
                const monthprog = ((stats.month.bookCount) / monthlyGoal);
                setMonthProgress(monthprog * 100)
            }

            if (stats.year && yearlyGoal) {
                const yearprog = (stats.year.bookCount / yearlyGoal)
                setYearProgress(yearprog * 100)
            }

            if (!monthlyGoal) {
                // setMonthProgress(null)
                console.log('no month goal, progress null')
            }
            if (!yearlyGoal) {
                // setYearProgress(null)
                console.log('no year goal, progress null')
            }
        }

        getProgress()
    }, [monthlyGoal, yearlyGoal, stats])

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
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                            <Stack direction='row' spacing={5}>
                                <IconButton size="small" onClick={prevMonth} disabled={month === 0}>
                                    <NavigateBeforeIcon /></IconButton>
                                <Typography variant='h6'>Your {months[month]} Activity</Typography>
                                <IconButton size="small"
                                    onClick={nextMonth}
                                    disabled={month === thismonth}>
                                    <NavigateNextIcon /></IconButton>
                            </Stack>

                            {stats.month ? <MonthlyStats stats={stats.month} month={month} monthProgress={monthProgress} monthlyGoal={monthlyGoal} updateGoal={updateGoal} newGoal={newGoal} />
                                : <MonthlyStats stats={null} month={month} monthlyGoal={monthlyGoal} updateGoal={updateGoal} newGoal={newGoal} />
                            }
                        </Box>

                        <Divider />
                    </Container>
                    }

                    {monthlyBooks && <Container sx={{ width: { xs: 1 / 1, md: 4 / 5 }, mr: 'auto', ml: 'auto', mb: '50px' }}>
                        <List sx={{ bgcolor: 'background.paper' }}>
                            {monthlyBooks.map((book) => (<React.Fragment>
                                <ListItem key={book.id} alignItems="flex-start" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Card sx={{
                                            height: { xs: 145, md: 218 }, width: { xs: 100, md: 148 }, '&:hover': {
                                                cursor: 'pointer'
                                            }
                                        }}>
                                            <CardMedia
                                                component='img'
                                                onClick={() => { navigate(`/book/${book.id}`) }}
                                                image={`${book.cover_img}`}
                                                alt={`${book.title}`}
                                                sx={{ height: { xs: 140, md: 218 }, width: { xs: 95, md: 148 } }}
                                            />
                                        </Card>
                                        <Box>
                                            <Typography sx={{
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer'
                                                },
                                            }} onClick={() => { navigate(`/book/${book.id}`) }} variant='subtitle2'>{book.title}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {book.author}
                                            </Typography>

                                        </Box>
                                    </Box>

                                    <Divider orientation='vertical' variant="inset" />

                                    <Box>
                                        <Typography variant='subtitle1'>You Rated It <Rating name="half-rating-read" defaultValue={parseInt(book.Reviews[0].rating)} precision={0.5} readOnly /></Typography>
                                        <Typography variant='subtitle1'>Total Pages Read: {book.pages}</Typography>
                                        <Typography variant='caption'>Read From: {dayjs(book.Reviews[0].date_started).format('MMM D, YYYY')} - {dayjs(book.Reviews[0].date_finished).format('MMM D, YYYY')}</Typography>
                                    </Box>


                                </ListItem>
                                <Divider key={`monthdivider-${book.id}`} component="li" />

                            </React.Fragment>))}

                            <Box sx={{ m: 3 }}>
                                <Typography variant='caption'>For a book to count towards your Reading Activity, it must be marked as Read and have a set Finished Date. <br /> You can continue to add books to this list at any point! </Typography>
                            </Box>

                        </List>
                    </Container>}
                </TabPanel>

                {/* year panel */}
                <TabPanel value={value} index={1} >
                    {stats && <Container>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                            <Stack direction='row' spacing={5}>
                                <IconButton size="small" onClick={prevYear} disabled={year === thisyear - 2}>
                                    <NavigateBeforeIcon /></IconButton>

                                <Typography variant='h6'>Your {year} Activity</Typography>
                                <IconButton size="small"
                                    onClick={nextYear}
                                    disabled={year === thisyear}>
                                    <NavigateNextIcon /></IconButton>
                            </Stack>


                            {stats.year ? <YearlyStats stats={stats.year} year={year} yearProgress={yearProgress} yearlyGoal={yearlyGoal} updateGoal={updateGoal} newGoal={newGoal} /> :
                                <YearlyStats stats={null} year={year} yearProgress={yearProgress} yearlyGoal={yearlyGoal} updateGoal={updateGoal} newGoal={newGoal} />
                            }

                        </Box>

                        <Divider />
                    </Container>}


                    {yearlyBooks && <Container sx={{ width: { xs: 1 / 1, md: 4 / 5 }, mr: 'auto', ml: 'auto', mb: '50px' }}>
                        <List sx={{ bgcolor: 'background.paper' }}>
                            {yearlyBooks.map((book) => (<React.Fragment>
                                <ListItem key={`${book.title}${book.id}month`} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent:'space-between', width:{xs: 1/1, lg:7/8} }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Card sx={{
                                            height: { xs: 145, md: 218 }, width: { xs: 100, md: 148 }, '&:hover': {
                                                cursor: 'pointer'
                                            }
                                        }}>
                                            <CardMedia
                                                component='img'
                                                onClick={() => { navigate(`/book/${book.id}`) }}
                                                image={`${book.cover_img}`}
                                                alt={`${book.title}`}
                                                sx={{ height: { xs: 140, md: 218 }, width: { xs: 95, md: 148 } }}
                                            />
                                        </Card>
                                        <Box sx={{ml:2}}>
                                            <Typography sx={{
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer'
                                                },
                                            }} onClick={() => { navigate(`/book/${book.id}`) }} variant='subtitle2'>{book.title}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {book.author}
                                            </Typography>
                                          
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
                            <Box sx={{ m: 3 }}>
                                <Typography variant='caption'>To add a book to your Reading Activity, mark it as Read and set a "Date Finished" at any point. </Typography>
                            </Box>

                        </List>
                    </Container>}
                </TabPanel>
            </SwipeableViews>
            <AddGoal addGoal={addGoal} setAddGoal={setAddGoal} action={action} goal={{
                month: monthlyGoal,
                year: yearlyGoal
            }} setMonthlyGoal={setMonthlyGoal} setYearlyGoal={setYearlyGoal} />
            <EditGoal editGoal={editGoal} setEditGoal={setEditGoal} action={action} goal={{
                month: monthlyGoal,
                year: yearlyGoal
            }} setMonthlyGoal={setMonthlyGoal} setYearlyGoal={setYearlyGoal} />
        </React.Fragment>
    )
}
