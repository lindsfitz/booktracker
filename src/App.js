import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import AppContext from "./AppContext";
import Login from './pages/Login';
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import Bookcase from "./pages/Bookcase";
import Shelf from "./pages/Shelf";
import Search from './pages/Search';
import AllBooks from "./pages/Books/AllBooks";
import OneBook from './pages/Books/OneBook';

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
        <BrowserRouter>
          {token && <Navigation />}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<Search />} />
            <Route path="/books" element={<AllBooks />} />
              <Route path="/book/:id" element={<OneBook />} />
              {/* <Route path="new" element={<NewBookForm />} /> */}
            <Route path="/shelves" element={<Bookcase />} />
            <Route path="/shelf/:id" element={<Shelf />} />
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>





    </div>
  );
}

export default App;
