import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ListItem, Divider, Typography, Box, Container, Stack } from '@mui/material/';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


export default function ShelfStack({ shelf }) {
    let navigate = useNavigate()

    const image1 = {
       
        height: 140,
        width: 92.5,
        position: 'absolute',
        left: '10%',
        top: '0px',
        zIndex: 2
    }

    const image2 = {
        height: 140,
        width: 92.5,
        position: 'absolute',
        top: '10px',
        left: '18%',
        zIndex: 1

    }

    const image3 = {
        height: 140,
        width: 92.5,
        position: 'absolute',
        top: '20px',
        left: '26%',
        zIndex: 0
    }

    const image4 = {
        height: 140,
        width: 92.5,
        position: 'absolute',
        top: '30px',
        left: '34%',
        zIndex: -1
    }

    const books = shelf.Books.slice(0, 4)



    return (
        <React.Fragment>
            <ListItem onClick={() => navigate(`/books/${shelf.id}`)} key={shelf.id} sx={{
                flexDirection: 'column', alignItems: 'flex-start', '&:hover': {
                    cursor: 'pointer'
                },
            }}>
                <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                    <Box sx={{ position: 'relative', height: '170px', width: '410px' }}>
                        {books[0] &&
                            <img src={books[0].cover_img} alt={books[0].title} style={image1} />
                        }
                        {books[1] &&
                            <img src={books[1].cover_img} alt={books[1].title} style={image2} />
                        }
                        {books[2] &&
                            <img src={books[2].cover_img} alt={books[2].title} style={image3} />
                        }
                        {books[3] &&
                            <img src={books[3].cover_img} alt={books[3].title} style={image4} />
                        }

                    </Box>
                    <Stack direction='row' spacing={2}>
                        <Typography variant='subtitle2'>
                            <Link to={`/books/${shelf.id}`} style={{
                                textDecoration: "none",
                                color: '#5F5B71'
                            }}>
                                {shelf.name}
                            </Link>
                        </Typography>
                        <ChevronRightIcon />
                    </Stack>
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