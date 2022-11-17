import { Container, Typography, Link, Divider } from "@mui/material"
import React from "react"
import PublicReview from "./PublicReview"


const CommunityReviews = ({ publicReviews }) => {

    return (
        <Container>
            <Box>
                <Typography variant='subtitle1'>{publicReviews.title}</Typography>
                <Typography variant='subtitle2'>Community Reviews</Typography>
                <Divider />
                <Box>
                    <Typography variant='body2'>Average Rating: {publicReviews.avg.avgRating}</Typography>
                    <Typography variant='body2'>{publicReviews.avg.count} Reviews</Typography>
                </Box>
                <Divider />
                <Box>
                    {publicReviews.reviews.map(review => (
                        <React.Fragment>
                            <Divider />
                            <Box>
                                <PublicReview review={review} />
                            </Box>
                            <Divider />
                        </React.Fragment>
                    ))}
                </Box>
            </Box>

        </Container>
    )


}