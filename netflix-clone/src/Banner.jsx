import React, { useEffect, useState } from "react";
import { instance } from "./axios";
import requests from "./requests";
import "./style/Banner.css";
import Youtube from "react-youtube";
import useMediaQuery from "@mui/material/useMediaQuery";
import movieTrailer from "movie-trailer";
import { Link } from "react-router-dom";

const base_url = "https://image.tmdb.org/t/p/original/";

function Banner() {
  const [movie, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [path, setPath] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const requestsArray =
        Object.keys(requests)[Math.round(Math.random() * 6)];
      const request = await instance.get(requests[requestsArray]);
      const randomMovie =
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ];
      setMovies(randomMovie);
      setPath(base_url + randomMovie.backdrop_path);
      return request;
    }
    fetchData();
  }, []);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
  const matches = useMediaQuery("(max-width: 620px)");
  useEffect(() => {
    if (matches) {
      setPath(base_url + movie?.poster_path);
    } else {
      setPath(base_url + movie?.backdrop_path);
    }
  }, [matches, []]);

  const handleClick = (movie) => {
    setLoading(true);
    const bannerButton = document.getElementById("playButton");
    bannerButton.innerText = "Close";
    if (trailerUrl) {
      setTrailerUrl("");
      bannerButton.innerText = "Play";
      setLoading(false);
    } else {
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
          bannerButton.innerText = "Play";

          setLoading(false);
        });
    }
  };
  return (
    <div>
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      <header
        className="banner"
        style={{
          backgroundImage: `linear-gradient(180.43deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0, 0.1) 100%),url(${path})`,
        }}
      >
        <div className="banner__contents">
          <h1 className="banner__title">
            {movie?.title ||
              movie?.name ||
              movie?.original_name ||
              movie?.original_title}
          </h1>

          <div className="banner__buttons">
            <button
              onClick={() => handleClick(movie)}
              title="Play"
              className="banner__button"
              id="playButton"
            >
              Play
            </button>
            <Link to={`/movie/${movie?.id}`}>
              <button title="Show details" className="banner__button">
                Show details
              </button>
            </Link>
          </div>
          <h1 className="banner__description">
            {truncate(movie?.overview, 150)}
          </h1>
        </div>

        <div className="banner--fadeBottom"></div>
      </header>
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Banner;
