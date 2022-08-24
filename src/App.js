import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import AppContext from "./AppContext";
import Navigation from "./components/Navigation";
import Dashboard from "./components/pages/Dashboard";
import AllBooks from "./components/pages/Books/AllBooks";
import OneShelf from "./components/pages/Shelves/OneShelf";
import AllShelves from "./components/pages/Shelves/AllShelves";
import Login from './components/pages/Login';

function App() {

  const [userData, setUserData] = useState(null)
  const [token, setToken] = useState(null)

  const userSettings = {
    userData: userData,
    setUserData: setUserData,
    token:token,
    setToken:setToken
  }


  return (
    <div className="App">
      {/* <Dashboard /> */}
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
            <Route path="/shelves" element={<AllShelves />} />
            <Route path="/shelf/:id" element={<OneShelf />} />
            {/* </Route> */}
            {/* </Route> */}
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>





    </div>
  );
}

export default App;
