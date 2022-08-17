import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import Dashboard from "./components/pages/Dashboard";
import AllBooks from "./components/pages/Books/AllBooks";
import OneShelf from "./components/pages/Shelves/OneShelf";
import AllShelves from "./components/pages/Shelves/AllShelves";

function App() {

  return (
    <div className="App">
      {/* <Dashboard /> */}




      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* <Route path='home' element={<Dashboard />} /> */}
          {/* <Route path="search" element={<Search />} /> */}
          <Route path="/books" element={<AllBooks />}>
            {/* <Route path=":bookId" element={<OneBook />} />
              <Route path="new" element={<NewBookForm />} /> */}
          </Route>
          <Route path="/shelves" element={<AllShelves />} />
          <Route path="/shelf" element={<OneShelf />} />
          {/* </Route> */}
          {/* </Route> */}
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
