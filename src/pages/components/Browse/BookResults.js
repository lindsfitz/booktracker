import React from 'react';
import { Box,Divider, List, ListItem, Container, Stack, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import Styles from '../../../utils/Styles'


const BookResults = ({ searchResults }) => {

    let navigate = useNavigate();
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <Container sx={{ mb: '60px', mt: 4 }}>
            <List sx={{ width: '100%', bgcolor: 'transparent' }}>
                {searchResults.map((book) => (
                    <React.Fragment>
                        <ListItem key={`${book.cover_edition_key}`}
                            alignItems="center"

                            onClick={mobile ? () => {
                                navigate(`/book/${book.edition_key[0]}`, {
                                    state: {
                                        published: book.first_publish_year,
                                        pages: book.number_of_pages_median,
                                        cover: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
                                        author: book.author_name[0],
                                        title: book.title,
                                        authorKey: book.author_key[0],
                                        worksKey: book.key
                                    }
                                })
                            } : null}
                        >
                            <Box sx={{
                                display: 'flex', width: { xs: 1 / 1, sm: 1 / 2, lg: 1 / 3 },
                                justifyContent: 'space-between',
                                mr: 'auto',
                                ml: 'auto',

                            }}>
                                <Box sx={{
                                    '&:hover': {
                                        cursor: 'pointer'
                                    },
                                }}>
                                    <img
                                        src={`https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`}
                                        alt={`${book.title}-cover`}
                                        style={Styles.medBookCover}
                                        loading="lazy"
                                        onClick={() => {
                                            navigate(`/book/${book.edition_key[0]}`, {
                                                state: {
                                                    published: book.first_publish_year,
                                                    pages: book.number_of_pages_median,
                                                    cover: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
                                                    author: book.author_name[0],
                                                    title: book.title,
                                                    authorKey: book.author_key[0],
                                                    worksKey: book.key
                                                }
                                            })
                                        }}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center', width: 1 / 2 }}>
                                    <Stack sx={{ alignSelf: 'center', ml: 1 }}>
                                        <Typography variant='subtitle1'
                                            sx={Styles.title}
                                            onClick={() => {
                                                navigate(`/book/${book.edition_key[0]}`, {
                                                    state: {
                                                        published: book.first_publish_year,
                                                        pages: book.number_of_pages_median,
                                                        cover: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
                                                        author: book.author_name[0],
                                                        title: book.title,
                                                        authorKey: book.author_key[0],
                                                        worksKey: book.key
                                                    }
                                                })
                                            }}
                                        >{book.title}</Typography>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {book.author_name && book.author_name[0]}
                                        </Typography>
                                    </Stack>
                                    <Stack sx={{ padding: 2 }}>
                                        <Typography variant='caption' color='text.secondary'>Published: {book.first_publish_year}</Typography>
                                        <Typography variant='caption' color='text.secondary'>{book.edition_count} editions</Typography>
                                    </Stack>
                                </Box>
                            </Box>
                        </ListItem>
                        <Divider key={`${book.title}-divider`} variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>
        </Container>
    )
}

export default BookResults;