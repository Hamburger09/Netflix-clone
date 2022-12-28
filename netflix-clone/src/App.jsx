import React, { useState, useEffect } from "react";
import "./style/App.css";
import Row from "./Row";
import requests from "./requests";
import Banner from "./Banner";
import Nav from "./Nav";
import Footer from "./Footer";
import SearchView from "./SearchView";
import { Routes, Route } from "react-router-dom";
import MovieView from "./MovieView";

function App() {
  const [search, setSearch] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (searchText) {
      async function getMovies() {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=14bf041fa050b017db724739e0e27663&language=en-US&query=${searchText}&page=1&include_adult=false`
        );
        const data = await response.json();

        setSearch(data.results);
      }
      getMovies();
    }
  }, [searchText]);
  return (
    <div className="App">
      <Nav
        searchText={searchText}
        setSearchText={setSearchText}
        setSearch={setSearch}
      />

      <Routes>
        <Route path="/movie/:id" element={<MovieView />} />
        <Route path="/search" element={<SearchView searchResults={search} />} />
        <Route
          path="/"
          element={
            <div>
              <Banner />

              <Row
                title="TRENDING NOW"
                fetchUrl={requests.fetchTrending}
                isLarge
                id="0"
              />
              <Row
                title="Netflix originals"
                fetchUrl={requests.fetchNetflixOriginals}
                id="1"
              />

              <Row id="2" title="Top Rated" fetchUrl={requests.fetchTopRated} />
              <Row
                title="Action Movies"
                id="3"
                fetchUrl={requests.fetchActionMovies}
              />
              <Row
                title="Comedy Movies"
                id="4"
                fetchUrl={requests.fetchComedyMovies}
              />
              <Row
                title="Horror Movies"
                id="5"
                fetchUrl={requests.fetchHorrorMovies}
              />
              <Row
                title="Romance Movies"
                id="6"
                fetchUrl={requests.fetchRomanceMovies}
              />
              <Row
                title="Documentaries"
                id="7"
                fetchUrl={requests.fetchDocumentaries}
              />
              <Footer />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
