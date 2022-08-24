import React, { useState, useEffect, useContext } from 'react';
import API from '../utils/API';
import AppContext from '../AppContext';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ImageListItem from '@mui/material/ImageListItem';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import AddShelf from './AddShelf'



export default function Bookcase() {
    const context = useContext(AppContext);

    const [userShelves, setUserShelves] = useState([])

    const renderShelves = async () => {
        const shelves = await API.getShelves(1)

        setUserShelves(shelves.data)
    }

    // use effect to perform api call on page load , change the shelves piece of state post use effect and use the state variable to render the dependent components?

    useEffect(()=>{
        renderShelves()
    },[])


    useEffect(()=>{
        console.log(userShelves)
        
    },[userShelves])



    return (


        <React.Fragment>
            {/* ONE LIST COMPONENT ALREADY EXISTS PRE DATA PULL */}
            {/* ***** ONCE DATA IS BEING PULLED VIA API SUCCESSFULLY - MAP OVER SHELF RESULTS. CREATE LIST ITEM COMPONENT FOR EACH SHELF IN RESULTS DATA & LIST ITEM TEXT FOR THE TITLE OF EACH SHELF */}
            {/* *** ONE IMAGE LIST ITEM IS CREATED FOR EACH BOOK INSIDE OF THE SHELF. JUST SET THE SRC TO THE IMAGE LINK FROM THE RESULTS */}
            <h1>All User Shelves</h1>
            <Button variant="outlined" onClick={context.toggleShelfDialog}>
                Add A Shelf
            </Button>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {userShelves.map((shelf) => (
                    <React.Fragment>
                        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Link to={`/shelf/${shelf.id}`}><ListItemText
                                primary={`${shelf.name}`}
                                sx={{ maxWidth: '10%' }}
                            /></Link>
                            <div style={{ display: 'flex', width: '100%' }}>

                                {shelf.Books.map((book) => (
                                    <ImageListItem key={book.title} sx={{ maxHeight: 218, maxWidth: 148, margin: 2 }}>
                                        <img
                                            src={`${book.cover_img}`}
                                            srcSet={`${book.cover_img}`}
                                            alt={`${book.title}`}
                                            loading="lazy"

                                        />
                                    </ImageListItem>

                                ))}
                            </div>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>

            {context.shelfDialog && <AddShelf />}



        </React.Fragment>
    )
}