import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../AppContext';
import API from '../utils/API'
import { Book } from '@mui/icons-material';
import { List, Container, ListItem, Divider, ListItemText, ImageListItem, Typography } from '@mui/material';
import { render } from '@testing-library/react';
import ReadingMobile from './components/mobile/ReadingMobile';
import OneShelf from './components/OneShelf';
import Carousel from './components/Carousel';
import ShelfStack from './components/ShelfStack';

export default function AllBooks() {
    const context = useContext(AppContext);

    const [currentReads, setCurrentReads] = useState(null);
    const [favoriteShelf, setFavoriteShelf] = useState(null)
    const [markedRead, setMarkedRead] = useState(null);
    const [ownedBooks, setOwnedBooks] = useState(null);
    const [previewShelves, setPreviewShelves] = useState(null)

    const renderCurrentReads = async () => {
        try {
            const reads = await API.getReadingList(context.userData.id)
            setCurrentReads(reads.data)
        } catch (err) { console.log(err) }
    }

    const renderShelves = async () => {
        try {
            const profile = await API.getProfile(context.userData.id)
            if (profile.data.favorite_shelf) {
                const favShelf = context.userShelves.filter(shelf => shelf.id === profile.data.favorite_shelf)
                setFavoriteShelf(favShelf)
                const otherShelves = context.userShelves.filter(shelf => shelf.id !== profile.data.favorite_shelf)
                setPreviewShelves(otherShelves)
            } else {
                setFavoriteShelf(context.userShelves[0])
                setPreviewShelves(context.userShelves.slice(1, 4))
            }
        } catch (err) { console.log(err) }
    }

    const renderReadShelf = async () => {
        try {
            const books = await API.newReadList(context.userData.id)
            setMarkedRead({
                name: 'Read',
                id: 'markedread',
                Books: books.data
            })
        } catch (err) { console.log(err) }
    }

    const renderOwned = async () => {
        try {
            const books = await API.getOwnedList(context.userData.id)
            setOwnedBooks(books.data)
        } catch (err) { console.log(err) }
    }





    useEffect(() => {

        /* On Page Load: Going to want to pull info for all the diff categories (or maybe pull from context? TBD ) */
        // currently reading 
        renderCurrentReads()
        // favorite shelf -- get profile for user, then id of shelf marked as fav, then pull shelf. If no shelf marked as fav,  most recently updated gets listed as favorite shelf (or pinned shelf?)
        // 3 shelf preview (3 most recently updated after pinned) -- also just has first book on shelf cover as a preview -- clicking brings you to shelf page
        renderShelves()
        // Read -- Just the cover image of the most recently marked read book; links to 'read' list
        renderReadShelf()
        // Owned -- same as above, just most recent cover
        renderOwned()
        // DNF @ bottom, most recent cover 

    }, [])


    // changing this entire page -- going to be more of an overview rather than a straight up list of all books
    // eventually this will be profile page? maybe?

    // Currently Reading section @ top again 
    // 'Favorite' Shelf -- can mark one shelf as fav shelf & this is featured on this page 
    // Read
    // Owned


    return (
        <React.Fragment>

            <Container id='mobile-currently-reading' sx={{ ml: 'auto', mr: 'auto', mt: 5, mb: 5, display: { xs: 'flex' }, flexDirection: 'column' }}>
                <Typography variant='subtitle2' color='text.secondary'>Currently Reading:</Typography>
                {currentReads && <ReadingMobile currentReads={currentReads} />}
            </Container>

            <Container>
                <Typography variant='subtitle2' color='text.secondary'>Pinned Shelf</Typography>
                <Divider />
                <List id='pinned-shelf' sx={{ width: '100%', bgcolor: 'transparent' }}>
                    {/* {favoriteShelf && <OneShelf shelf={favoriteShelf} length={4} />} */}
                    {favoriteShelf && <Carousel shelf={favoriteShelf} />}

                </List>
                <Divider />
            </Container>

            <Container>
            </Container>

            <List id='marked-read' sx={{ width: '100%', bgcolor: 'transparent' }}>
                {markedRead && <ShelfStack shelf={markedRead} />}

            </List>

            <Container sx={{mb:'50px'}}>
                <Typography variant='subtitle2' color='text.secondary'>Bookshelves</Typography>
                <Divider />
                <List id='preview-shelves' sx={{ display: 'flex', bgcolor: 'transparent' }}>
                    {previewShelves &&
                        <React.Fragment>
                            {previewShelves.map(shelf => (
                                <OneShelf shelf={shelf} length={1} />
                            ))}
                        </React.Fragment>
                    }

                </List>
                <Divider />
            </Container>





        </React.Fragment>
    )
}