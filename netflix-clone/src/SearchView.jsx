import React, { useState, useRef } from "react";
import "./style/searchView.css";
import Row from "./Row";
import requests from "./requests";
import Banner from "./Banner";
import { Link } from "react-router-dom";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import movieTrailer from "movie-trailer";
import Youtube from "react-youtube";
import CloseIcon from "@mui/icons-material/Close";
import Footer from "./Footer";

const imageUrl = "https://image.tmdb.org/t/p/w500";

const SearchView = ({ searchResults }) => {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = (movie) => {
    setLoading(true);
    movieTrailer(
      movie?.name ||
        movie?.title ||
        movie?.original_name ||
        movie?.original_title ||
        ""
    )
      .then((url) => {
        const urlParams = new URLSearchParams(new URL(url).search);
        setTrailerUrl(urlParams.get("v"));
        setLoading(false);
      })
      .catch((error) => {
        alert("No video found😔");
        setLoading(false);
      });
  };

  const closeClick = () => {
    setTrailerUrl("");
  };

  const scrollHandle = () => {
    window.scrollTo({
      top: "0",
    });
  };
  const opts = {
    height: "410",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  if (searchResults.length !== 0) {
    return (
      <div className="View">
        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
        {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
        {trailerUrl && (
          <div className="closeButton" onClick={closeClick}>
            <CloseIcon />
            <p>Close Video</p>
          </div>
        )}
        <div className="searchView">
          {searchResults.map((movie) => {
            return (
              <div key={movie.id} className="searchCard">
                {movie.backdrop_path ? (
                  <img src={imageUrl + movie.backdrop_path} alt="Null" />
                ) : (
                  <div style={{ display: "none" }}></div>
                )}
                <h2>{movie.original_title}</h2>
                <div
                  className="playButton"
                  onClick={() => handleClick(movie)}
                  onClickCapture={scrollHandle}
                >
                  <PlayCircleOutlineIcon />
                  <p class="playButtonText">Play</p>
                </div>
                <div className="detailsButtonDiv">
                  <Link className="detailsButton" to={`/movie/${movie.id}`}>
                    Show details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <Footer />
      </div>
    );
  } else {
    return (
      <>
        <Banner />

        <Row
          title="NETFLIX ORIGINALS"
          fetchUrl={requests.fetchNetflixOriginals}
          isLargeRow
        />

        <Row title="Trending Now" fetchUrl={requests.fetchTrending} />
        <Row title="Top Rated" fetchUrl={requests.fetchTopRated} />
        <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} />
        <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} />
        <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} />
        <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} />
        <Row title="Documentaries" fetchUrl={requests.fetchDocumentaries} />
        <Footer />
      </>
    );
  }
};
export default SearchView;
