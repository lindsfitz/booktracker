import React from 'react';
import { Typography, Box, Rating, Stack, CircularProgress, Link } from '@mui/material';

// IF month stats exist, render this component

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

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export default function MonthlyStats({ stats, monthProgress, monthlyGoal, month, updateGoal, newGoal }) {

    const date = new Date();
    const thismonth = date.getMonth()

    if (stats === null) {
        return (
            <React.Fragment>
                {month === thismonth ? (
                    <Box>
                        <CircularProgressWithLabel value={0} />
                        <br />
                        <Typography variant='subtitle1'>You haven't marked any books as read so far this month.</Typography>
                        {monthlyGoal ? (
                            <Stack>
                                {/* <Typography>Your activity goal for {months[month]} is {monthlyGoal} books. </Typography> */}
                                <Typography>Get reading to reach your {months[month]} activity goal of {monthlyGoal} books. </Typography>
                                <Link onClick={() => updateGoal('month')}
                                    color='secondary'
                                    component="button" underline="hover" variant='caption'>
                                    update activity goal
                                </Link>

                            </Stack>
                        ) : (
                            <Link onClick={() => newGoal('month')}
                                color='secondary'
                                component="button" underline="hover" variant='caption'>
                                add an activity goal
                            </Link>
                        )}
                    </Box>
                ) : (<Typography variant='subtitle1'>You didn't mark any books as read in {months[month]}.</Typography>)}
            </React.Fragment >
        )
    }

    return (
        <React.Fragment>
            <div>
                {month === thismonth ? (
                    <React.Fragment>
                        {monthProgress ? (<React.Fragment>
                            <CircularProgressWithLabel value={monthProgress} />
                            <br />
                            <Link onClick={() => updateGoal('month')}
                                color='secondary'
                                component="button" underline="hover" variant='caption'>
                                update activity goal
                            </Link>
                            <Typography variant='subtitle2'>You have read {stats.bookCount} of {monthlyGoal} books this month.</Typography>
                        </React.Fragment>) : (
                            <React.Fragment>
                                <CircularProgressWithLabel value={0} />
                                <br />
                                <Typography variant='caption'>No Activity Goal</Typography>
                                <Link onClick={() => newGoal('month')}
                                    color='secondary'
                                    component="button" underline="hover" variant='caption'>
                                    add an activity goal
                                </Link>
                                <Typography variant='subtitle2'>You have read {stats.bookCount} books so far this month.</Typography>
                            </React.Fragment>
                        )}

                        <Typography variant='subtitle2'>That adds up to {stats.totalPages} pages.</Typography>
                        <Typography variant='subtitle2'>On average, you gave books </Typography>
                        <Stack direction='row' spacing={1} justifyContent='center'>
                            <Rating name="half-rating-read" value={parseInt(stats.avgRating)} precision={0.5} readOnly size="small" />
                            <Typography>stars.</Typography>
                        </Stack>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {monthProgress ?
                            (<React.Fragment>
                                <CircularProgressWithLabel value={monthProgress} />
                                <Typography variant='subtitle2'>You read {stats.bookCount} of {monthlyGoal} books this month.</Typography>

                            </React.Fragment>) : (
                                <React.Fragment>
                                    <Typography variant='caption'>You didn't set an Activity Goal for {months[month]}</Typography><br />
                                    <Typography variant='subtitle2'>You read {stats.bookCount} books this month.</Typography>
                                </React.Fragment>
                            )
                        }
                        <Typography variant='subtitle2'>That adds up to {stats.totalPages} total pages read.</Typography>
                        <Typography variant='subtitle2'>On average, you rated books </Typography>
                        <Stack direction='row' spacing={1} justifyContent='center'>
                            <Rating name="half-rating-read" value={parseInt(stats.avgRating)} precision={0.5} readOnly size="small" />
                            <Typography>stars.</Typography>
                        </Stack>
                    </React.Fragment>
                )}
            </div>

        </React.Fragment>
    )
}