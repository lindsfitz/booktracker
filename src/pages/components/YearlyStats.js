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


export default function YearlyStats({ stats, yearProgress, yearlyGoal, year, updateGoal, newGoal }) {

    const date = new Date();
    const thisyear = date.getFullYear()

    if (stats === null) {
        return (
            <React.Fragment>
                {year === thisyear ? (
                    <Stack>
                        <CircularProgressWithLabel value={0} />
                        <Typography variant='subtitle1'>You haven't marked any books as read so far this year.</Typography>
                        {yearlyGoal ? (
                            <Stack>
                                {/* <Typography>Your activity goal for {year} is {yearlyGoal} books. </Typography> */}
                                <Typography>Get reading to reach your {year} activity goal of {yearlyGoal} books. </Typography>
                                <Link onClick={() => updateGoal('year')}
                                    component="button" underline="hover" variant='caption'>
                                    update activity goal
                                </Link>

                            </Stack>
                        ) : (
                            <Link onClick={() => newGoal('year')}
                                component="button" underline="hover" variant='caption'>
                                add an activity goal
                            </Link>
                        )}
                    </Stack>
                ) : (<Typography variant='subtitle1'>You didn't mark any books as read in {year}.</Typography>)}
            </React.Fragment >
        )
    }

    return (
        <React.Fragment>

            {year === thisyear ? (
                <React.Fragment>
                    {yearProgress ? (
                        <React.Fragment>
                            <CircularProgressWithLabel value={yearProgress} />
                            <br />
                            <Link onClick={() => updateGoal('year')}
                                component="button" underline="hover" variant='caption'>
                                update activity goal
                            </Link>
                            <Typography variant='subtitle2'>You have finished {stats.bookCount} of {yearlyGoal} books this year.</Typography>
                        </React.Fragment>

                    ) : (
                        <React.Fragment>
                            <CircularProgressWithLabel value={0} />
                            <br />
                            <Typography variant='caption'>No Activity Goal</Typography>
                            <Link onClick={() => newGoal('year')}
                                component="button" underline="hover" variant='caption'>
                                add an activity goal
                            </Link>
                            <Typography variant='subtitle2'>You have finished {stats.bookCount} books this year.</Typography>

                        </React.Fragment>
                    )}
                    <Typography variant='subtitle2'>That adds up to {stats.totalPages} pages so far</Typography>
                    <Typography variant='subtitle2'>On average, you gave books </Typography>
                    <Stack direction='row' spacing={1} justifyContent='center'>
                        <Rating name="half-rating-read" value={parseInt(stats.avgRating)} precision={0.5} readOnly size="small" />
                        <Typography>stars.</Typography>
                    </Stack>

                </React.Fragment>

            ) : (
                <React.Fragment>
                    {yearProgress ? (
                        <React.Fragment>
                            <CircularProgressWithLabel value={yearProgress} />
                            <br />
                            <Typography variant='subtitle2'>You finished {stats.bookCount} of {yearlyGoal} books this year.</Typography>

                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Typography variant='caption'>You didn't set an Activity Goal for {year}</Typography><br />
                            <Typography variant='subtitle2'>You finished {stats.bookCount} books this year.</Typography>
                        </React.Fragment>
                    )}
                    <Typography variant='subtitle2'>That adds up to {stats.totalPages} pages so far</Typography>
                    <Typography variant='subtitle2'>On average, you gave books </Typography>
                    <Stack direction='row' spacing={1} justifyContent='center'>
                        <Rating name="half-rating-read" value={parseInt(stats.avgRating)} precision={0.5} readOnly size="small" />
                        <Typography>stars.</Typography>
                    </Stack>

                </React.Fragment>
            )}



        </React.Fragment>
    )
}