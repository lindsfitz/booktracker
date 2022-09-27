import React, { useContext, useEffect } from 'react';
import API from '../../utils/API';
import AppContext from '../../AppContext';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, TextField } from '@mui/material';
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


export default function AddGoal({addGoal, setAddGoal, action, goal}) {
    const context = useContext(AppContext);

  
    const addActivityGoal = () => {
        console.log('add goal')
        console.log(action)
    }
    
    useEffect(()=>{
        console.log(goal)

    },[])

    return (
        <>
            <AddGoalDialog
                onClose={()=>setAddGoal(!addGoal)}
                aria-labelledby="customized-dialog-title"
                open={addGoal}
            >
                <AddGoalDialogTitle id="customized-dialog-title" onClose={()=>setAddGoal(!addGoal)}>
                    Edit Your Shelf
                </AddGoalDialogTitle>
                <Box component='form' noValidate onSubmit={addActivityGoal} >
                    <DialogContent dividers>
                        <TextField
                            id="name"
                            name='name'
                            label="Bookshelf Name"
                            // defaultValue={shelf.name}
                            multiline
                        /><br /><br />
                        <TextField
                            id="description"
                            name='description'
                            label="Description"
                            // defaultValue={shelf.description}
                            multiline
                            rows={4}

                        />
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus type='submit'>
                            Set Goal
                        </Button>
                        <Button autoFocus onClick={addActivityGoal}>
                            click meeeee
                        </Button>
                    </DialogActions>
                </Box>
            </AddGoalDialog>
        </>
    );
}