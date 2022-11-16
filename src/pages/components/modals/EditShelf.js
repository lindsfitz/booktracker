import React, { useContext, useState, useEffect } from 'react';
import API from '../../../utils/API';
import AppContext from '../../../AppContext';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, TextField, Chip, Stack, Typography, Switch, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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
    const [checked, setChecked] = useState(false);
    const [tags, setTags] = useState(null)

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const handleTagDelete = async (tag) => {
        try {
            await API.untagShelf({
                shelfId: shelf.id,
                tagId: tag.id
            })
            const shelftags = tags.filter(item => item.id !== tag.id)
            setTags(shelftags)
        } catch (error) {
            
        }
    }

    const handleAddTag = async (tag) => {
        try {
            await API.tagShelf({
                shelfId: shelf.id,
                tagId: tag.id
            })
            setTags([...tags, tag])
        } catch (err) { console.log(err) }
    }

    const shelfSubmit = async (e) => {
        e.preventDefault();
        console.log('submitted')
        const data = new FormData(e.currentTarget)
        let now = new Date()

        const updatedShelf = {
            name: data.get('name'),
            public: !checked,
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

    useEffect(() => {
        setChecked(!shelf.public)
        setTags(shelf.Tags)
    }, [shelf])


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
                                defaultValue={shelf.name}
                                multiline
                            />
                            <TextField
                                sx={{ width: { xs: 1 / 1, md: 1 / 2 } }}
                                id="description"
                                name='description'
                                label="Description"
                                defaultValue={shelf.description}
                                multiline
                                rows={6}

                            />
                            <Box>
                                {tags && tags.map(tag => <Chip key={tag.name} label={tag.name} onDelete={() => handleTagDelete(tag)} />)}
                            </Box>
                            <Autocomplete
                                sx={{ width: 3 / 5 }}
                                freeSolo
                                size='small'
                                onChange={(event, newValue) => {
                                    handleAddTag(newValue)
                                }}
                                disableClearable
                                options={context.tags}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={
                                            <React.Fragment>
                                                <Stack direction='row' spacing={0.5} alignItems='center'>
                                                    <SearchIcon fontSize="small" />
                                                    <Typography variant='caption'>Find a tag</Typography>
                                                </Stack>
                                            </React.Fragment>}
                                        InputProps={{
                                            ...params.InputProps,
                                            type: 'search',
                                        }}
                                    />
                                )}
                                renderOption={(props, option) => <li {...props}>{option.name}</li>}
                            />
                        </Stack>

                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center' }}>
                        <Button color='secondary' autoFocus type='submit'>
                            Update Shelf
                        </Button>
                    </DialogActions>
                </Box>
            </EditShelfDialog>
        </div>
    );
}