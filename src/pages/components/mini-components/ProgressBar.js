
import PropTypes from 'prop-types';

import { Box, Typography, LinearProgress } from '@mui/material';


function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress color='info'
                    sx={{ height: '10px' }} variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="caption" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
};


export default function ProgressBar({ progress }) {

    return (
        <Box sx={{ width: 1 / 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: 7 / 8 }}>
                <LinearProgressWithLabel value={progress} />
            </Box>

        </Box>
    )
}