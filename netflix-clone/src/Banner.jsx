import React, { useEffect, useState } from "react";
import { instance } from "./axios";
import requests from "./requests";
import "./style/Banner.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

function Banner() {
  const [movie, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await instance.get(requests.fetchActionMovies);
      setMovies(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      );
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

  const handleClick = (movie) => {
    const bannerButton = document.getElementById("playButton");
    bannerButton.innerText = "Close";
    if (trailerUrl) {
      setTrailerUrl("");
      bannerButton.innerText = "Play";
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
        })
        .catch((error) => alert("No video found😔"));
    }
  };

  return (
    <div>
      <header
        className="banner"
        style={{
          backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
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
            <button title="My List" className="banner__button">
              My List
            </button>
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
