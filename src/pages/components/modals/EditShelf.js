import React, { useContext } from 'react';
import API from '../../../utils/API';
import AppContext from '../../../AppContext';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';


const EditShelfDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    textAlign: 'center',
}));

const EditShelfDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2, mt: 10 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 20,
                        top: 50,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

EditShelfDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};


export default function EditShelf({ shelf, setEditShelf, editShelf }) {
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
            <EditShelfDialog
                fullScreen
                onClose={() => setEditShelf(!editShelf)}
                aria-labelledby="customized-dialog-title"
                open={editShelf}
            >
                <EditShelfDialogTitle id="customized-dialog-title" onClose={() => setEditShelf(!editShelf)}>
                    Edit Your Shelf
                </EditShelfDialogTitle>
                <Box component='form' noValidate onSubmit={shelfSubmit} >
                    <DialogContent dividers>
                        <TextField
                            sx={{ width: { xs: 1 / 1, md: 1 / 2 } }}
                            id="name"
                            name='name'
                            label="Bookshelf Name"
                            defaultValue={shelf.name}
                            multiline
                        /><br /><br />
                        <TextField
                            sx={{ width: { xs: 1 / 1, md: 1 / 2 } }}
                            id="description"
                            name='description'
                            label="Description"
                            defaultValue={shelf.description}
                            multiline
                            rows={6}

                        />
                    </DialogContent>
                    <DialogActions sx={{justifyContent:'center'}}>
                        <Button autoFocus type='submit'>
                            Update Shelf
                        </Button>
                    </DialogActions>
                </Box>
            </EditShelfDialog>
        </div>
    );
}