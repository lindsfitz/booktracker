import React, { useState, useContext, useEffect } from 'react';
import API from '../utils/API';
import AppContext from '../AppContext';
import { Typography, Container, Stack, Switch, Box, Chip, TextField, FormControl, Select, MenuItem, Autocomplete, Divider, Avatar, Button, Link, Snackbar, Alert } from '@mui/material';


export default function Settings() {
    const context = useContext(AppContext);

    const [profileData, setProfileData] = useState(null);
    const [privateCheck, setPrivateCheck] = useState(false);
    const [pinned, setPinned] = useState("");
    const [profileTags, setProfileTags] = useState(null)
    const [allTags, setAllTags] = useState(null);
    const [tagSearch, setTagSearch] = useState(null)
    const [openUpdated, setOpenUpdated] = useState(null)

    const handlePrivate = (event) => {
        setPrivateCheck(event.target.checked);
    };

    const handlePinned = (event) => {
        setPinned(event.target.value);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenUpdated(false);
    };

    const addProfileTag = async (tag) => {
        try {
            await API.tagProfile({
                profileId: profileData.id,
                tagId: tag.id
            })
            setProfileTags([...profileTags, tag])
        } catch (error) {
            console.log(error)
        }
    }

    const handleTagDelete = async (tag) => {
        try {
            await API.untagProfile(profileData.id, tag.id)
            const proftags = profileTags.filter(item => item.id !== tag.id)
            setProfileTags(proftags)
        } catch (error) {
            console.log(error)
        }
    }


    const avatar = () => {
        if (profileData.profile_picture) {
            return <Avatar
                alt={profileData.display_name}
                src={profileData.profile_picture}
                sx={{ width: 70, height: 70 }}
            />
        }

        return <Avatar
            alt={profileData.display_name}
            // src={profileData.profile_picture}
            sx={{ width: 70, height: 70 }}
        />
    }

    const updateProfile = async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget);
        const update = {
            public: privateCheck,
            favorite_shelf: pinned,
            first_name: data.get('firstName'),
            display_name: data.get('displayName'),
            username: data.get('username'),
            about_me: data.get('bio'),
        }

        const updated = await API.updateProfile(context.userData.id, update)

        if (updated.data[0]) {
            setProfileData(update)
            setOpenUpdated(true)
        }
    }


    useEffect(() => {
        const pageLoad = async () => {
            try {
                const profile = await API.getProfile(context.userData.id)
                setProfileData(profile.data)
                setPrivateCheck(profile.data.public)
                if (profile.data.favorite_shelf) { setPinned(profile.data.favorite_shelf) }
                setProfileTags(profile.data.Tags)

                const tags = await API.allTags()
                const tagOptions = [];

                tags.data.map(tag => {
                    profile.data.Tags.some(prof => { prof.id === tag.id ? console.log('already tagged') : tagOptions.push(tag) })
                })

                setAllTags(tagOptions)

            } catch (error) {
                console.log(error)
            }
        }
        pageLoad();
        // getTags();
    }, [])



    return (
        <Container sx={{ m: 1, mb: '50px' }}>
            <Typography sx={{ ml: 3 }} variant='h6'>Account Settings</Typography>
            <Divider variant='middle' />
            {profileData && <Stack spacing={3} sx={{ p: {xs:1, md:3}, width: { xs: 1 / 1, sm: 3 / 4, md: 1 / 2 } }}>

                {/* cloudinary upload for profile picture -- avatar to display this pic */}
                <Stack spacing={1} sx={{ p: 3 }}>
                    {avatar()}
                    <Link underline='hover' color='secondary' variant='caption'>update photo</Link>
                </Stack>

                {/* autocomplete box that adds chips -- can also click chips to remove chips/tags; these are a users fav genres/topics and show up as suggested search by subject on Browse page */}
                <Stack spacing={1}>
                    <Stack spacing={0.5}>
                        <Typography variant='subtitle2'>Favorite Genres & Topics:</Typography>
                        {profileTags && <Box>
                            {profileTags.map(tag => <Chip key={tag.name} label={tag.name} onDelete={() => handleTagDelete(tag)} />)}
                        </Box>}
                    </Stack>
                    {allTags && <Autocomplete
                        sx={{ width: 3 / 5 }}
                        // freeSolo
                        size='small'
                        value={tagSearch}
                        onChange={(event, newValue) => {
                            //   setSearchValue(newValue);
                            addProfileTag(newValue)
                        }}
                        disableClearable
                        options={allTags}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                            <TextField

                                {...params}
                                label="Add More Favorites..."
                                InputProps={{
                                    ...params.InputProps,
                                    type: 'search',
                                }}
                            />
                        )}
                        renderOption={(props, option) => <li {...props}>{option.name}</li>}
                    />}
                </Stack>

                <Box
                    component="form"
                    onSubmit={updateProfile}
                    noValidate
                    autoComplete="off"
                >
                    <Stack spacing={3} >
                        <Stack sx={{mr:1}}>
                            <Typography variant='subtitle1'>Profile</Typography>
                            <Divider />
                        </Stack>

                        {/* toggle for private vs public profile */}
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <Typography variant='subtitle2'>Private Profile:</Typography>
                            <Switch
                                color='secondary'
                                checked={privateCheck}
                                onChange={handlePrivate}
                                inputProps={{ 'aria-label': 'privateSwitch' }}
                            />
                        </Stack>

                        {/* drop down menu of existing shelves to choose from -- featured on AllBooks and Profile page -- CANNOT add new shelf here, only pick from existing shelves. defaults to TBR for new users */}
                        <Stack spacing={1}>
                            <Typography variant='subtitle2'>Pinned Shelf: </Typography>
                            <FormControl
                                size="small"
                                sx={{ m: 1, width: 3 / 5 }}>
                                <Select
                                    id="pinned"
                                    value={pinned}
                                    onChange={handlePinned}
                                >
                                    {context.userShelves.map(shelf => <MenuItem value={shelf.id}>{shelf.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Stack>

                        {/* first name */}
                        <Stack spacing={1}>
                            <Typography variant='subtitle2'>First Name:</Typography>
                            <TextField sx={{ m: 1, width: 3 / 5 }}
                                id="firstName"
                                name="firstName"
                                defaultValue={profileData.first_name || ''}
                                size="small"

                            />
                        </Stack>

                        {/* preferred name */}
                        <Stack spacing={1}>
                            <Typography variant='subtitle2'>Display Name:</Typography>
                            <TextField sx={{ m: 1, width: 3 / 5 }}
                                id="displayName"
                                name="displayName"
                                defaultValue={profileData.display_name}
                                size="small"

                            />
                        </Stack>

                        {/* username -- can search for users by username, in profile link */}
                        <Stack spacing={1}>
                            <Typography variant='subtitle2'>Username:</Typography>
                            <TextField sx={{ m: 1, width: 3 / 5 }}
                                id="username"
                                name="username"
                                defaultValue={profileData.username}
                                size="small"

                            />
                        </Stack>

                        {/* lil about me paragraph section */}
                        <Stack spacing={1}>
                            <Typography variant='subtitle2'>About Me:</Typography>
                            <TextField sx={{ m: 1, width: 3 / 5 }}
                                id="bio"
                                name="bio"
                                multiline
                                rows={5}
                                defaultValue={profileData.about_me}
                                size="small"

                            />
                        </Stack>

                        <Button sx={{ width: 2 / 5 }} size='small' type='submit' color='success' variant='outlined'>Save Changes</Button>

                    </Stack>
                </Box>

                <Stack>
                    <Stack>
                        <Typography variant='subtitle1'>Account</Typography>
                        <Divider />
                    </Stack>


                    <Stack spacing={1} sx={{ width: 3 / 5, py: 2 }}>

                        {/* Links to update email -- nodemailer? to confirm email -- also have to change password to change email */}
                        {/* Link to update password -- have to enter old password & new password */}
                        <Button color='success'>Update Email Address</Button>

                        <Button variant='outlined' color='success'>Change Password</Button>
                    </Stack>
                </Stack>


            </Stack>}

            <Snackbar open={openUpdated} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '90%' }}>
                    Profile Info Updated
                </Alert>
            </Snackbar>

        </Container>
    )

}