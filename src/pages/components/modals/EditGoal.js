import React, { useContext, useEffect, useState } from 'react';
import API from '../../../utils/API';
import AppContext from '../../../AppContext';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';


const EditGoalDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const EditGoalDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle variant='subtitle1' sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

EditGoalDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


export default function EditGoal({ editGoal, setEditGoal, action, goal, setMonthlyGoal, setYearlyGoal }) {
    const context = useContext(AppContext);

    const [current, setCurrent] = useState(null)
    const [goalValue, setGoalValue] = useState(null)


    const updateActivityGoal = (e) => {
        e.preventDefault();
        console.log('submitted')
        const data = new FormData(e.currentTarget)
        const newGoal = data.get('goal')

        const monthGoal = {
            month: thismonth,
            value: newGoal
        }

        const yearGoal = {
            month:null,
            value: newGoal
        }

        if (goalValue === newGoal) {
            console.log('same goal value')
            return;
        }

        if (action === 'month') {
            API.updateGoal(context.userData.id, monthGoal)
            setMonthlyGoal(parseInt(newGoal))
            setEditGoal(false)
        }

        if (action === 'year') {
            API.updateGoal(context.userData.id, yearGoal)
            setYearlyGoal(parseInt(newGoal))
            setEditGoal(false)
        }
    }

    const date = new Date();
    const thismonth = date.getMonth()
    const thisyear = date.getFullYear()

    useEffect(() => {
        if (action === 'month') {
            setCurrent(months[thismonth]);
            setGoalValue(goal.month)
        }
        if (action === 'year') {
            setCurrent(thisyear);
            setGoalValue(goal.year)
        }

    }, [action, goal, thismonth, thisyear])

    return (
        <>
            <EditGoalDialog
                onClose={() => setEditGoal(!editGoal)}
                aria-labelledby="customized-dialog-title"
                open={editGoal}
            >
                <EditGoalDialogTitle id="customized-dialog-title" onClose={() => setEditGoal(!editGoal)}>
                    Update Reading Activity
                </EditGoalDialogTitle>
                <Box component='form' noValidate onSubmit={updateActivityGoal} >
                    <DialogContent dividers>
                        <Typography variant='subtitle2'>Change the number of books <br /> you'd like to read in {current}.</Typography>
                        <br /><br />
                        <TextField
                            id={action}
                            name="goal"
                            label={`Goal for this ${action}`}
                            defaultValue={goalValue}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={() => setEditGoal(!editGoal)}>
                            Cancel
                        </Button>
                        <Button autoFocus type='submit'>
                            Update
                        </Button>
                    </DialogActions>
                </Box>
            </EditGoalDialog>
        </>
    );
}