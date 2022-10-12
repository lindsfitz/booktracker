import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction, Paper, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import ReorderIcon from '@mui/icons-material/Reorder';
import SearchIcon from '@mui/icons-material/Search';


export default function BottomNav(){
    let navigate = useNavigate();
    const theme = useTheme();
    // const xs = useMediaQuery('(max-width:450px)')
    const smxs = useMediaQuery(theme.breakpoints.down('sm'))

    const [value, setValue] = useState(0);

    return (
        <>
        {smxs ? (
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            >
              <BottomNavigationAction onClick={() => navigate('/')} label="Home" icon={<HomeIcon />} />
              <BottomNavigationAction onClick={() => navigate('/bookcase')}  label="Bookcase" icon={<ReorderIcon />} />
              <BottomNavigationAction onClick={() => navigate('/books')}  label="All Books" icon={<BookIcon />} />
              <BottomNavigationAction onClick={() => navigate('/browse')} label="Browse" icon={<SearchIcon />} />
            </BottomNavigation>
          </Paper>
        ) : null } 
        </>
    )
}