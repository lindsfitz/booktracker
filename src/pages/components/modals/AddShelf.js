import React, { useContext, useState } from 'react';
import API from '../../../utils/API';
import AppContext from '../../../AppContext';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, TextField, Stack, Typography, Switch, Autocomplete, Chip } from '@mui/material';
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
    const [checked, setChecked] = useState(false);
    const [tagIds, setTagIds] = useState([])

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const addShelfTag = (tag) => {
        console.log(tag)
        setTagIds(tag)
    }

    const shelfSubmit = (e) => {
        e.preventDefault();
        console.log('submitted')
        const data = new FormData(e.currentTarget)
        let now = new Date()

        const newShelf = {
            name: data.get('name'),
            public: !checked,
            description: data.get('description'),
            last_update: now,
            UserId: context.userData.id
        }

        API.newShelf(newShelf).then(async res => {
            tagIds.forEach(async tag => {
                console.log(tag)
                console.log(res.data.id)
                console.log(tag.id)
                await API.tagShelf({
                    shelfId: res.data.id,
                    tagId: tag.id
                })
            })
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
                        <Stack spacing={2}>
                            <Stack direction='row' alignItems='center' spacing={1}>
                                <Typography variant='subtitle2'>Private:</Typography>
                                <Switch
                                    color='secondary'
                                    checked={checked}
                                    onChange={handleChange}
                                    inputProps={{ 'aria-label': 'privateSwitch' }}
                                />
                            </Stack>
                            <TextField
                                sx={{ width: { xs: 1 / 1, md: 1 / 2 } }}
                                id="name"
                                name='name'
                                label="Bookshelf Name"
                                placeholder="Name"
                                multiline
                            />
                            <TextField
                                sx={{ width: { xs: 1 / 1, md: 1 / 2 } }}
                                id="description"
                                name='description'
                                label="Description"
                                multiline
                                rows={6}

                            />
                        </Stack>
                        <Stack spacing={1}>
                            <Stack spacing={0.5}>
                                <Typography variant='subtitle2'>Shelf Tags:</Typography>
                            </Stack>
                            <Autocomplete
                                multiple
                                id="tags-filled"
                                options={context.tags}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, newValue) => {
                                    addShelfTag(newValue)
                                }}
                                freeSolo
                                filterSelectedOptions
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip variant="outlined" label={option.name} {...getTagProps({ index })} />
                                    ))}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="filled"
                                        label="Tags"
                                    />
                                )}
                            />

                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center' }}>
                        <Button color='secondary' autoFocus type='submit'>
                            Create Shelf
                        </Button>
                    </DialogActions>
                </Box>
            </ShelfDialog>
        </div>
    );
}