import React, { useContext } from 'react';
import API from '../../../utils/API';
import AppContext from '../../../AppContext';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';


const ShelfDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    textAlign: 'center',
}));

const ShelfDialogTitle = (props) => {
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

ShelfDialogTitle.propTypes = {
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
            <ShelfDialog
            fullScreen
                onClose={context.toggleShelfDialog}
                aria-labelledby="customized-dialog-title"
                open={context.shelfDialog}
            >
                <ShelfDialogTitle id="customized-dialog-title" onClose={context.toggleShelfDialog}>
                    New Shelf
                </ShelfDialogTitle>
                <Box component='form' noValidate onSubmit={shelfSubmit} >
                    <DialogContent dividers>
                        <TextField
                        sx={{ width: { xs: 1 / 1, md: 1 / 2 } }}
                            id="name"
                            name='name'
                            label="Bookshelf Name"
                            placeholder="Name"
                            multiline
                        /><br /><br />
                        <TextField
                        sx={{ width: { xs: 1 / 1, md: 1 / 2 } }}
                            id="description"
                            name='description'
                            label="Description"
                            multiline
                            rows={6}

                        />
                    </DialogContent>
                    <DialogActions sx={{justifyContent:'center'}}>
                        <Button color='secondary' autoFocus type='submit'>
                            Create Shelf
                        </Button>
                    </DialogActions>
                </Box>
            </ShelfDialog>
        </div>
    );
}