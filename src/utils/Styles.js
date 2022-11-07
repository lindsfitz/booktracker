
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
    title: {
        '&:hover': {
            textDecoration: 'underline',
            cursor: 'pointer'
        },
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

// styles from SHELF
const titleBoxStyle = {
        p: 3,
        textAlign: 'center',
        maxWidth: { xs: 3 / 4, sm: 1 / 2 },
        mr: 'auto',
        ml: 'auto'
    }

const shelfbookBoxStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        width: { xs: 1 / 1, sm: 3 / 4, md: 1 / 2 },
        mr: 'auto',
        ml: 'auto'
    }

    // booklist
    const booklistBoxStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        width: { xs: 3 / 4, sm: 2 / 6 },
        mr: { xs: 1, md: 'auto' },
        ml: { xs: 1, md: 'auto' }
    }

    // One shelf 
    const cardStyle = {
        maxWidth: 345,
        backgroundColor: 'transparent',
        boxShadow: 0,
        '&:hover': {
            cursor: 'pointer'
        }
    }
    // READING ACTIVITY 
    const image = { height: { xs: 140, md: 218 }, width: { xs: 95, md: 148 } }

// note / book info / review 

const clampedStyle = {
    height: 230,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
}

const unclampedStyle = {
    height: 'fit-content'
}


export default Styles;