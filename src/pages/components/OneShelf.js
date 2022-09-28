import React, { useState, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
// import EditShelf from './components/EditShelf';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { List, ListItem, Divider, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Card, CardMedia, CardContent, Container, ButtonGroup, IconButton, Tooltip, useMediaQuery } from '@mui/material/';


export default function OneShelf({ shelf, length }) {
    let navigate = useNavigate()

    return (
        <React.Fragment>
            <ListItem key={`${shelf.name}${shelf.id}lg`} id={`${shelf.name}${shelf.id}`} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='subtitle1'>
                        <Link to={`/shelf/${shelf.id}`} style={{
                            textDecoration: "none",
                            color: '#5F5B71'
                        }}>
                            {shelf.name}
                        </Link>
                    </Typography>
                </Container>
                <div style={{ display: 'flex', width: '100%' }}>
                    {shelf.Books.slice(0, length).map((book) => (
                        <Card sx={{ maxWidth: 345 }} key={`${shelf.name}${book.id}`} className='book-card'>
                            <CardContent>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    onClick={() => { navigate(`/book/${book.id}`) }}
                                    image={`${book.cover_img}`}
                                    alt={`${book.title}`}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ListItem>
            <Divider key={`${shelf.id}dividerlg`} />
        </React.Fragment>
    )
}