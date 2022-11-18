import React from 'react';
import { Box, Divider, List, ListItem, Container, Stack, Typography, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs'
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import Styles from '../../../utils/Styles'
import API from '../../../utils/API'


const SubjectResults = ({ searchResults, nytSearch }) => {

    let navigate = useNavigate();
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('md'))

    const olSearch = async (volumeInfo) => {
        const bookFind = await API.olBookISBN(volumeInfo.industryIdentifiers[0].identifier)
        if (bookFind.data) {
            const key = bookFind.data.key.split('/')
            navigate(`/book/${key[2]}`, {
                state: {
                    origin:'gb',
                    author: volumeInfo.authors[0],
                    authorKey: bookFind.data.authors[0].key,
                    title: volumeInfo.title,
                    description: volumeInfo.description,
                    cover: volumeInfo.imageLinks.smallThumbnail,
                    published: dayjs(volumeInfo.publishedDate).format('MMM D, YYYY'),
                    pages: volumeInfo.pageCount,
                    isbn: volumeInfo.industryIdentifiers[0].identifier
                }
            })
        }

        if (bookFind.code) {
            console.log('this book is missing from OL cause it sucks')
        }
    }

    return (
        <Container sx={{ mb: '60px', mt: 4 }}>
            <List sx={{ width: '100%', bgcolor: 'transparent' }}>
                {searchResults.map((book) => (
                    <React.Fragment>
                        <ListItem key={`${book.volumeInfo.title}`}
                            alignItems="center"

                            onClick={mobile ? () => olSearch(book.volumeInfo) : null}
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
                                        src={book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.smallThumbnail : null}
                                        alt={`${book.volumeInfo.title}-cover`}
                                        style={Styles.medBookCover}
                                        loading="lazy"
                                        onClick={() => olSearch(book.volumeInfo)}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center', width: 1 / 2 }}>
                                    <Stack sx={{ alignSelf: 'center', ml: 1 }}>
                                        <Typography variant='subtitle1'
                                            sx={Styles.title}
                                            onClick={() => olSearch(book.volumeInfo)}
                                                // nytSearch(book.volumeInfo.industryIdentifiers[0].identifier, book.volumeInfo.title, book.volumeInfo.authors[0])}
                                        >{book.volumeInfo.title}</Typography>
                                      {book.volumeInfo.authors && <Typography
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {book.volumeInfo.authors[0]}
                                        </Typography>}
                                    </Stack>
                                    <Stack sx={{ padding: 2 }}>
                                        <Typography variant='caption' color='text.secondary'>Published: {dayjs(book.volumeInfo.publishedDate).format('MMM D, YYYY')}</Typography>
                                        {/* <Typography variant='caption' color='text.secondary'>{book.edition_count} editions</Typography> */}
                                    </Stack>
                                </Box>
                            </Box>
                        </ListItem>
                        <Divider key={`${book.volumeInfo.title}-divider`} variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>
        </Container>
    )
}

export default SubjectResults;