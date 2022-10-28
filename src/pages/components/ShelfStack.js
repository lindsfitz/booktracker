import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ListItem, Divider, Typography, Card, CardMedia, Box, CardContent, Container, Paper } from '@mui/material/';


export default function ShelfStack({ shelf }) {
    let navigate = useNavigate()

    const cardStyle = {
        maxWidth: 345,
        backgroundColor: 'transparent',
        boxShadow: 0,
    }

    const imageStyle = {
        boxShadow: '3px 2px 6px #888888',
        height: 140,
        width: 92.5
    }

    const image1 = {
        // boxShadow: '3px 2px 6px #888888',
        height: 140,
        width: 92.5,
        position: 'absolute',
        left: '10%',
        top: '45px',
        zIndex:2
    }

    const image2 ={ 
        height: 140,
        width: 92.5,
        position: 'absolute',
        top:'50px',
        left: '11%',
        zIndex: 1

    }

    const image3 ={ 
        height: 140,
        width: 92.5,
        position: 'absolute',
        top:'55px',
        left: '12%',
        zIndex:0
    }

    const image4 ={ 
        height: 140,
        width: 92.5,
        position: 'absolute',
        top:'60px',
        left: '13%',
        zIndex:-1
    }

    const books = shelf.Books.slice(0, 4)



    return (
        <React.Fragment>
            <ListItem key={shelf.id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '230px' }}>
                    <Box sx={{ position: 'relative', height:'100%', width:'100%' }}>
                        {books[0] &&
                            <img src={books[0].cover_img} style={image1} />
                        }
                        {books[1] &&
                                <img src={books[1].cover_img} style={image2} />
                            }
                        {books[2] &&
                            <img src={books[2].cover_img} style={image3} />
                        }
                        {books[3] &&
                            <img src={books[3].cover_img} style={image4} />
                        }

                    </Box>
                    <Typography variant='subtitle2'>
                        <Link to={`/shelf/${shelf.id}`} style={{
                            textDecoration: "none",
                            color: '#5F5B71'
                        }}>
                            {shelf.name}
                        </Link>
                    </Typography>
                </Container>
                {/* <div style={{ display: 'flex', width: '100%' }}>
                    {shelf.Books.slice(0, 4).map((book) => (
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
                </div> */}
            </ListItem>
            <Divider key={`${shelf.id}dividerlg`} />
        </React.Fragment>
    )
}