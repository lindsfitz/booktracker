import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { ThemeProvider, styled } from '@mui/material/styles';
import AppContext from "./AppContext";
import Login from './pages/Login';
import Navigation from "./pages/components/Navigation";
import Dashboard from "./pages/Dashboard";
import Bookcase from "./pages/Bookcase";
import Shelf from "./pages/Shelf";
import Search from './pages/Search';
import AllBooks from "./pages/AllBooks";
import UserBook from './pages/UserBook';
import ResultBook from './pages/ResultBook';
import ReadingActivity from './pages/ReadingActivity';
// import AddReview from './pages/AddReview';
// import './app.css'
import { themeOptions } from './utils/Theme';
import Booklist from './pages/Booklist';

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
              <Route path="/search" element={<Search />} />
              <Route path="works/:id" element={<ResultBook />} />
              <Route path="/books" element={<AllBooks />} />
              <Route path="/book/:id" element={<UserBook />} />
              <Route path="/books/:list" element={<Booklist />} />
              <Route path="/shelves" element={<Bookcase />} />
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
