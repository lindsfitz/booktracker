import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import AppContext from "./AppContext";
import Login from './pages/Login';
import Navigation from "./pages/components/Navigation";
import Dashboard from "./pages/Dashboard";
import Bookcase from "./pages/Bookcase";
import Shelf from "./pages/Shelf";
import Search from './pages/Search';
import AllBooks from "./pages/AllBooks";
import ReadingActivity from './pages/ReadingActivity';
// import './app.css'
import { themeOptions } from './utils/Theme';
import Booklist from './pages/Booklist';
import Book from './pages/Book';

function App() {

  const [userData, setUserData] = useState(null)
  const [token, setToken] = useState(null)
  const [userShelves, setUserShelves] = useState([])

  // usestate for adding shelf dialog
  const [shelfDialog, setshelfDialog] = useState(false);
  const toggleShelfDialog = () => {
    setshelfDialog(!shelfDialog)
  }

  // state variables being added to context
  const userSettings = {
    userData: userData,
    setUserData: setUserData,
    token: token,
    setToken: setToken,
    userShelves: userShelves,
    setUserShelves: setUserShelves,
    shelfDialog: shelfDialog,
    toggleShelfDialog: toggleShelfDialog
  }


  return (
    <div className="App">
      <AppContext.Provider value={userSettings}>
        <ThemeProvider theme={themeOptions}>

          <BrowserRouter>
            {token && <Navigation />}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/browse" element={<Search />} />
              <Route path="/books" element={<AllBooks />} />
              <Route path="/books/:list" element={<Booklist />} />
              <Route path="/book/:id" element={<Book />} />
              <Route path="/bookcase" element={<Bookcase />} />
              <Route path="/shelf/:id" element={<Shelf />} />
              <Route path="/activity" element={<ReadingActivity />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AppContext.Provider>





    </div>
  );
}

export default App;
