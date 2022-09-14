import React, { useContext } from 'react';
import API from '../../utils/API';
import AppContext from '../../AppContext';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
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

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};


export default function AddShelf() {
    const context = useContext(AppContext);

    const shelfSubmit = (e) => {
        e.preventDefault();
        console.log('submitted')
        const data = new FormData(e.currentTarget)
        let now = new Date()

        const newShelf = {
            name: data.get('name'),
            description: data.get('description'),
            last_update: now,
            UserId: context.userData.id
        }

        API.newShelf(newShelf).then(async res => {
            console.log(res)
            const shelves = await API.getShelves(context.userData.id)
            context.setUserShelves(shelves.data)
            context.toggleShelfDialog();

        })

    }


    return (
        <div>
            <BootstrapDialog
                onClose={context.toggleShelfDialog}
                aria-labelledby="customized-dialog-title"
                open={context.shelfDialog}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={context.toggleShelfDialog}>
                    New Shelf
                </BootstrapDialogTitle>
                <Box component='form' noValidate onSubmit={shelfSubmit} >
                    <DialogContent dividers>
                        <TextField
                            id="name"
                            name='name'
                            label="Bookshelf Name"
                            placeholder="Name"
                            multiline
                        /><br /><br />
                        <TextField
                            id="description"
                            name='description'
                            label="Description"
                            multiline
                            rows={4}

                        />
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus type='submit'>
                            Create Shelf
                        </Button>
                    </DialogActions>
                </Box>
            </BootstrapDialog>
        </div>
    );
}