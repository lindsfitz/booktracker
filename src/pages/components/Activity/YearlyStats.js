import React from 'react';
import { Typography, Rating, Stack, Link } from '@mui/material';
import ProgressCircle from '../mini-components/ProgressCircle';


// IF month stats exist, render this component


export default function YearlyStats({ stats, yearProgress, yearlyGoal, year, updateGoal, newGoal }) {

    const date = new Date();
    const thisyear = date.getFullYear()

    if (stats === null) {
        return (
            <React.Fragment>
                {year === thisyear ? (
                    <Stack>
                        <ProgressCircle value={0} />
                        <Typography variant='subtitle1'>You haven't marked any books as read so far this year.</Typography>
                        {yearlyGoal ? (
                            <Stack>
                                {/* <Typography>Your activity goal for {year} is {yearlyGoal} books. </Typography> */}
                                <Typography>Get reading to reach your {year} activity goal of {yearlyGoal} books. </Typography>
                                <Link onClick={() => updateGoal('year')}
                                    color='secondary'
                                    component="button" underline="hover" variant='caption'>
                                    update activity goal
                                </Link>

                            </Stack>
                        ) : (
                            <Link onClick={() => newGoal('year')}
                                color='secondary'
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
                            <ProgressCircle value={yearProgress} />
                            <br />
                            <Link onClick={() => updateGoal('year')}
                                color='secondary'
                                component="button" underline="hover" variant='caption'>
                                update activity goal
                            </Link>
                            <Typography variant='subtitle2'>You have finished {stats.bookCount} of {yearlyGoal} books this year.</Typography>
                        </React.Fragment>

                    ) : (
                        <React.Fragment>
                            <ProgressCircle value={0} />
                            <br />
                            <Typography variant='caption'>No Activity Goal</Typography>
                            <Link onClick={() => newGoal('year')}
                                color='secondary'
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
                            <ProgressCircle value={yearProgress} />
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