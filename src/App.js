import Navigation from "./components/Navigation";
import Dashboard from "./components/pages/Dashboard";

function App() {
  return (
    <div className="App">
      <Navigation />
      <Dashboard />




      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}>
            <Route path='home' element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="books" element={<AllBooks />}>
              <Route path=":bookId" element={<OneBook />} />
              <Route path="new" element={<NewBookForm />} />
            </Route>
            <Route path="shelves" element={<AllShelves />}>
              <Route path=":shelfId" element={<Bookshelf />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter> */}

    </div>
  );
}

export default App;
