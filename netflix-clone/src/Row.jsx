import React, { useState, useEffect } from "react";
import { instance } from "./axios";
import "./style/row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // A snippet of code which runs based on a specific condition/variable
  useEffect(() => {
    // if [], run once when the row loads, and don't run again
    // Whenever I use anything inside of a useEffect froum outside, I have to include in dependencies
    async function fetchData() {
      const request = await instance.get(fetchUrl);
      setMovies(request.data.results);

      return request.data.results;
    }
    fetchData().catch((error) => console.warn(error));
  }, [fetchUrl]); // dependencies
  // console.log(movies);

  const handleButtonClick = () => {
    if (open === true) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
  const closeClick = () => {
    setTrailerUrl("");
  };

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
        setLoading(false);
        setTrailerUrl(urlParams.get("v"));
      })
      .catch((error) => {
        setLoading(false);
        alert("No video found😔");
      });
  };

  return (
    <div className="row">
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      <h2>{title}</h2>

      <div className="row__posters">
        {movies.map((movie) => {
          if (movie.backdrop_path) {
            return (
              <div key={movie.id} className="row__posterDiv">
                <img
                  loading="lazy"
                  onClick={handleButtonClick}
                  className={`row__poster ${
                    title == "NETFLIX ORIGINALS" && "row__posterLarge"
                  }`}
                  src={`${base_url}${
                    title == "NETFLIX ORIGINALS"
                      ? movie.backdrop_path
                      : movie.poster_path
                  }`}
                  alt={movie.name}
                />
                {open && (
                  <div className="dropdown">
                    <ul>
                      <li onClick={() => handleClick(movie)}>Watch trailer</li>
                      <Link className="rowDetails" to={`/movie/${movie.id}`}>
                        <li>Show details</li>
                      </Link>
                    </ul>
                  </div>
                )}
              </div>
            );
          } else {
            return <div style={{ display: "none" }} key={movie.id}></div>;
          }
        })}
      </div>
      {trailerUrl && (
        <div className="closeButton" onClick={closeClick}>
          <CloseIcon />
          <p>Close Video</p>
        </div>
      )}
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
