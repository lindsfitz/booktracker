import React from 'react';
import { Box, Divider, List, ListItem, Container, Stack, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import Styles from '../../utils/Styles'


const SubjectResults = ({ searchResults, nytSearch }) => {

    let navigate = useNavigate();
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <Container sx={{ mb: '60px', mt: 4 }}>
            <List sx={{ width: '100%', bgcolor: 'transparent' }}>
                {searchResults.map((book) => (
                    <React.Fragment>
                        <ListItem key={`${book.volumeInfo.title}`}
                            alignItems="center"

                            onClick={mobile ? () => nytSearch(book.volumeInfo.industryIdentifiers[0].identifier, book.volumeInfo.title, book.volumeInfo.authors[0]) : null}
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
                                        onClick={() => () => nytSearch(book.volumeInfo.industryIdentifiers[0].identifier, book.volumeInfo.title, book.volumeInfo.authors[0])}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center', width: 1 / 2 }}>
                                    <Stack sx={{ alignSelf: 'center', ml: 1 }}>
                                        <Typography variant='subtitle1'
                                            sx={Styles.title}
                                            onClick={() => nytSearch(book.volumeInfo.industryIdentifiers[0].identifier, book.volumeInfo.title, book.volumeInfo.authors[0])}
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
                                        <Typography variant='caption' color='text.secondary'>Published: {book.volumeInfo.publishedDate}</Typography>
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