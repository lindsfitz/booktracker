import React, { useContext, useEffect , useState} from 'react';
import API from '../../utils/API';
import AppContext from '../../AppContext';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';


const AddGoalDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const AddGoalDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
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

AddGoalDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export default function AddGoal({addGoal, setAddGoal, action, setMonthlyGoal, setYearlyGoal}) {
    const context = useContext(AppContext);

    const [current, setCurrent] = useState(null)

    const date = new Date();
    const thismonth = date.getMonth()
    const thisyear = date.getFullYear()

  
    const addActivityGoal = (e) => {
        e.preventDefault();
        console.log('submitted')
        const data = new FormData(e.currentTarget)
        const newGoal = data.get('goal')

        const monthGoal = {
            month: thismonth,
            value: newGoal,
            UserId: context.userData.id
        }

        const yearGoal = {
            month:null,
            value: newGoal,
            UserId: context.userData.id
        }

        if (action === 'month') {
            API.newGoal(monthGoal)
            setMonthlyGoal(parseInt(newGoal))
            setAddGoal(false)
        }

        if (action === 'year') {
            API.newGoal(yearGoal)
            setYearlyGoal(parseInt(newGoal))
            setAddGoal(false)
        }
    }
    
    useEffect(() => {
        if (action === 'month') {
            setCurrent(months[thismonth]);
        }
        if (action === 'year') {
            setCurrent(thisyear);
        }

    }, [action, thismonth, thisyear])

    return (
        <>
            <AddGoalDialog
                onClose={()=>setAddGoal(!addGoal)}
                aria-labelledby="customized-dialog-title"
                open={addGoal}
            >
                <AddGoalDialogTitle id="customized-dialog-title" onClose={()=>setAddGoal(!addGoal)}>
                    Reading Activity Goal
                </AddGoalDialogTitle>
                <Box component='form' noValidate onSubmit={addActivityGoal} >
                    <DialogContent dividers>
                    <Typography variant='subtitle2'>Set your goal number of books <br /> you'd like to read in {current}.</Typography>
                        <br /><br />
                        <TextField
                            id={action}
                            name="goal"
                            label={`Goal for this ${action}`}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={()=>setAddGoal(!addGoal)}>
                            Cancel
                        </Button>
                        <Button autoFocus type='submit'>
                            Set Goal
                        </Button>
                    </DialogActions>
                </Box>
            </AddGoalDialog>
        </>
    );
}