import React, { useState } from "react";
import "./style/searchView.css";
import Row from "./Row";
import requests from "./requests";
import Banner from "./Banner";
import { Link, useNavigate } from "react-router-dom";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import movieTrailer from "movie-trailer";
import Youtube from "react-youtube";
import CloseIcon from "@mui/icons-material/Close";
import Footer from "./Footer";
import LoadingCard from "./LoadingPosts";
import ProgressiveImage from "react-progressive-graceful-image";

const imageUrl = "https://image.tmdb.org/t/p/w500";

const SearchView = ({ searchResults }) => {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
  const place = (
    <div className="loadingPost">
      <div className="imagePost"></div>
    </div>
  );

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
                  <ProgressiveImage
                    src={imageUrl + movie.backdrop_path}
                    placeholder=""
                  >
                    {(src, loading) => {
                      return loading ? (
                        place
                      ) : (
                        <div>
                          <img src={src} alt="an Image" loading="lazy" />
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
                            <Link
                              className="detailsButton"
                              to={`/movie/${movie.id}`}
                            >
                              Show details
                            </Link>
                          </div>
                        </div>
                      );
                    }}
                  </ProgressiveImage>
                ) : (
                  <div>
                    <div style={{ display: "none" }}></div>
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
                )}
              </div>
            );
          })}
        </div>
        <Footer />
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <h1 style={{ fontSize: "100px" }}>Oops, no results</h1>
      </div>
    );
  }
};
export default SearchView;
