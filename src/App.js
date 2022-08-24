import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import AppContext from "./AppContext";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import AllBooks from "./pages/Books/AllBooks";
import Shelf from "./pages/Shelf";
import Bookcase from "./pages/Bookcase";
import Login from './pages/Login';

function App() {

  const [userData, setUserData] = useState(null)
  const [token, setToken] = useState(null)
  // usestate for adding shelf dialog
  const [shelfDialog, setshelfDialog] = useState(false);
  const toggleShelfDialog = () => {
    setshelfDialog(!shelfDialog)
  }

  // state variables being added to context
  const userSettings = {
    userData: userData,
    setUserData: setUserData,
    token:token,
    setToken:setToken,
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
            {/* <Route path='home' element={<Dashboard />} /> */}
            {/* <Route path="search" element={<Search />} /> */}
            <Route path="/books" element={<AllBooks />}>
              {/* <Route path=":bookId" element={<OneBook />} />
              <Route path="new" element={<NewBookForm />} /> */}
            </Route>
            <Route path="/shelves" element={<Bookcase />} />
            <Route path="/shelf/:id" element={<Shelf />} />
            {/* </Route> */}
            {/* </Route> */}
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>





    </div>
  );
}

export default App;
