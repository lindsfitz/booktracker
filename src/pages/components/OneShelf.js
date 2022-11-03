import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ListItem, Divider, Typography, Card, CardMedia, CardContent, Container } from '@mui/material/';


export default function OneShelf({ shelf, length }) {
    let navigate = useNavigate()

    const cardStyle = {
        maxWidth: 345,
        backgroundColor: 'transparent',
        boxShadow: 0,
        '&:hover': {
            cursor: 'pointer'
        }
    }

    const imageStyle = {
        boxShadow: '3px 2px 6px #888888',
        height: 140,
        width: 92.5,
    }



    return (
        <React.Fragment>
            <ListItem key={`${shelf.name}${shelf.id}lg`} id={`${shelf.name}${shelf.id}`} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='subtitle2'>
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
                        <Card sx={cardStyle} key={`${shelf.name}${book.id}`} className='book-card'>
                            <CardContent>
                                <CardMedia
                                    component="img"
                                    style={imageStyle}
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