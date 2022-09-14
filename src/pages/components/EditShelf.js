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


export default function EditShelf({shelf, setEditShelf, editShelf}) {
    const context = useContext(AppContext);

    const shelfSubmit = async (e) => {
        e.preventDefault();
        console.log('submitted')
        const data = new FormData(e.currentTarget)
        let now = new Date()

        const updatedShelf = {
            name: data.get('name'),
            description: data.get('description'),
            last_update: now,
        }

        console.log(updatedShelf)

        const updated = await API.editShelf(updatedShelf, shelf.id)
        const shelves = await API.getShelves(context.userData.id)
        context.setUserShelves(shelves.data)
        console.log(updated)
        setEditShelf(false)

    }


    return (
        <div>
            <BootstrapDialog
                onClose={()=>setEditShelf(!editShelf)}
                aria-labelledby="customized-dialog-title"
                open={editShelf}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={()=>setEditShelf(!editShelf)}>
                    Edit Your Shelf
                </BootstrapDialogTitle>
                <Box component='form' noValidate onSubmit={shelfSubmit} >
                    <DialogContent dividers>
                        <TextField
                            id="name"
                            name='name'
                            label="Bookshelf Name"
                            defaultValue={shelf.name}
                            multiline
                        /><br /><br />
                        <TextField
                            id="description"
                            name='description'
                            label="Description"
                            defaultValue={shelf.description}
                            multiline
                            rows={4}

                        />
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus type='submit'>
                            Update Shelf
                        </Button>
                    </DialogActions>
                </Box>
            </BootstrapDialog>
        </div>
    );
}