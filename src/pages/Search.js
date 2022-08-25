// Search page for new books to add to your bookshelf
import React, { useState, useEffect } from 'react';
import API from '../utils/API';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

export default function Search() {
    const [searchBy, setSearchBy] = useState('');
    const [searchTerm, setSearchTerm] = useState('')

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleChange = (event) => {
        setSearchBy(event.target.value);
    };

    const searchResults = async () => {
        const books = await API.getByTitle(searchTerm)
        console.log(books)
    }

    //   useEffect(()=>{
    //     searchResults()
    //   },[])


    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Search By</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={searchBy}
                        label="Search"
                        onChange={handleChange}
                    >
                        <MenuItem value={'title'}>Title</MenuItem>
                        <MenuItem value={'author'}>Author</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <TextField onChange={handleInputChange} id="standard-basic" label="Search..." variant="standard" />
            <Button onClick={searchResults}>Search</Button>
        </Box>
    );
}