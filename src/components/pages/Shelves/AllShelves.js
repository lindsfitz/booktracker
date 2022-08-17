import React, { useState, useEffect, useContext } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ImageListItem from '@mui/material/ImageListItem';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import AddShelf from '../AddShelf'


const tempData = [
    {
        name: 'Faves',
        description: 'All time favorite books',
        Books: [
            {
                title: "House of Earth and Blood",
                author: "Sarah J. Maas",
                cover_img: "https://covers.openlibrary.org/b/olid/OL27924119M-M.jpg",
                pages: 816,
                edition_key: "OL35866018M"
            },
            {
                title: "House of Sky and Breath",
                author: "Sarah J. Maas",
                cover_img: "https://covers.openlibrary.org/b/olid/OL28946291M-M.jpg",
                pages: 807,
            },
            {
                title: "The Ruin of Kings",
                author: "Jenn Lyons",
                cover_img: "https://covers.openlibrary.org/b/olid/OL27760114M-M.jpg",
                pages: 576,
                edition_key: "OL29792696M"
            },
            {
                title: "The Memory of Souls",
                author: "Jenn Lyons",
                cover_img: "https://covers.openlibrary.org/b/olid/OL28178905M-M.jpg",
                pages: 656,
                edition_key: "OL29831091M"
            },
            {
                title: "The Discord of Gods",
                author: "Jenn Lyons",
                cover_img: "https://covers.openlibrary.org/b/olid/OL34161957M-M.jpg",
                pages: 512,
                edition_key: "OL37998226M"
            },
        ]


    },
    {
        name: "TBR",
        description: "Desperately want to read these",
        Books: [
            {
                title: "Empire of Storms",
                author: "Sarah J. Maas",
                cover_img: "https://covers.openlibrary.org/b/olid/OL26319926M-M.jpg",
                pages: 712,
                edition_key: "OL27696715M"
            },
            {
                title: "A Court of Wings and Ruin",
                author: "Sarah J. Maas",
                cover_img: "https://covers.openlibrary.org/b/olid/OL26832221M-M.jpg",
                pages: 720,
                edition_key: "OL37072070M"
            },
            {
                title: "A Court of Thorns and Roses",
                author: "Sarah J. Maas",
                cover_img: "https://covers.openlibrary.org/b/olid/OL27099075M-M.jpg",
                pages: 432,
                edition_key: "OL31959292M"
            },
            {
                title: "A Court of Mist and Fury",
                author: "Sarah J. Maas",
                cover_img: "https://covers.openlibrary.org/b/olid/OL26992991M-M.jpg",
                pages: 640,
                edition_key: "OL32856480M"
            },

        ]
    },
    {
        name: "Upcoming Releases",
        description: "Counting Down the Days",
        Books: [
            {
                title: "House of Sky and Breath",
                author: "Sarah J. Maas",
                cover_img: "https://covers.openlibrary.org/b/olid/OL28946291M-M.jpg",
                pages: 807,
            },
            {
                title: "The Discord of Gods",
                author: "Jenn Lyons",
                cover_img: "https://covers.openlibrary.org/b/olid/OL34161957M-M.jpg",
                pages: 512,
                edition_key: "OL37998226M"
            },

        ]
    },
    {
        name: "DNF",
        description: "Boo these books",
        Books: [
            {
                title: "A Touch of Darkness",
                author: "Scarlett St. Clair",
                cover_img: "https://covers.openlibrary.org/b/olid/OL28946291M-M.jpg",
                pages: 354,
                edition_key: "OL31995429M"
            },
        ]
    },
]



export default function AllShelves({ user }) {

    const [shelfDialog, setshelfDialog] = useState(false);

    const handleShelfDialog = () => {
        setshelfDialog(true);
    };
    const handleCloseShelfDialog = () => {
        setshelfDialog(false);
    };



    return (


        <React.Fragment>
            {/* ONE LIST COMPONENT ALREADY EXISTS PRE DATA PULL */}
            {/* ***** ONCE DATA IS BEING PULLED VIA API SUCCESSFULLY - MAP OVER SHELF RESULTS. CREATE LIST ITEM COMPONENT FOR EACH SHELF IN RESULTS DATA & LIST ITEM TEXT FOR THE TITLE OF EACH SHELF */}
            {/* *** ONE IMAGE LIST ITEM IS CREATED FOR EACH BOOK INSIDE OF THE SHELF. JUST SET THE SRC TO THE IMAGE LINK FROM THE RESULTS */}
            <h1>All User Shelves</h1>
            <Button variant="outlined" onClick={handleShelfDialog}>
                Add A Shelf
            </Button>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {tempData.map((shelf) => (
                    <React.Fragment>
                        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Link to='/shelf'><ListItemText
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

            {shelfDialog && <AddShelf shelfDialog={shelfDialog} handleCloseShelfDialog={handleCloseShelfDialog}/>}



        </React.Fragment>
    )
}