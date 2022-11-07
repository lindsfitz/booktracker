import { Typography, Box, CircularProgress } from '@mui/material';

export default function ProgressCircle(props) {
    return (
        <Box>
            <Box sx={{ position: 'relative' }}>
                <CircularProgress
                    variant="determinate"
                    sx={{
                        color: (theme) =>
                            theme.palette.grey[200],
                        position: 'absolute'
                    }}
                    size={50}
                    thickness={6}
                    {...props}
                    value={100}
                />
                {/* <Box sx={{
                    position: 'absolute', top: 0, left: 0,
                    bottom: 0,
                    right: 0, display: 'inline-flex'
                }}> */}
                <CircularProgress
                    size={50}
                    thickness={6}
                    variant="determinate" {...props} />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="caption" component="div" color="text.secondary">
                        {`${Math.round(props.value)}%`}
                    </Typography>
                </Box>
                {/* </Box> */}
            </Box>
        </Box>

    );
}