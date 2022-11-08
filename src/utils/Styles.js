
const Styles = {
    smallBookCover: {
        boxShadow: '3px 2px 6px #888888',
        height: 140,
        width: 92.5,
    },
    medBookCover: {
        boxShadow: '3px 2px 6px #888888',
        width: 148,
        height: 218,
    },
    coverShadow: {
        boxShadow: '3px 2px 6px #888888',
    },
    title: {
        '&:hover': {
            textDecoration: 'underline',
            cursor: 'pointer'
        },
    },
    bookListBox: {
        display: 'flex',
        justifyContent: 'space-between',
        width: { xs: 1 / 1, sm: 3 / 4, md: 1 / 2 },
        mr: 'auto',
        ml: 'auto'
    },
    clampedText: {
        height: 230,
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    }, 
    unclampedText: {
        height:'fit-content'
    }
}


export default Styles;