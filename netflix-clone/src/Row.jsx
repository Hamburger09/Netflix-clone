import React, { useState, useEffect, useRef } from "react";
import { instance } from "./axios";
import "./style/row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import useMediaQuery from "@mui/material/useMediaQuery";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import InfoIcon from "@mui/icons-material/Info";
import LoadingPosts from "./LoadingPosts";
import ProgressiveImage from "react-progressive-graceful-image";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLarge, id }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  // A snippet of code which runs based on a specific condition/variable
  useEffect(() => {
    // if [], run once when the row loads, and don't run again
    // Whenever I use anything inside of a useEffect froum outside, I have to include in dependencies
    async function fetchData() {
      const request = await instance.get(fetchUrl);
      setMovies(request.data.results);
      setImgLoading(false);

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
  const placeholder = isLarge ? (
    <div
      // style={{
      //   backgroundColor: "gray",
      //   height: "250px",
      //   width: "420px",
      //   filter: "blur(5px)",
      //   transform: "translateY(46px)",
      //   zIndex: "3",
      // }}
      className="face face1 placeholderLoadingLarge"
    />
  ) : (
    <div className="face face1">{LoadingPosts}</div>
  );

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
    window.scrollBy({
      top: "300",
    });
  };
  const rowPosters = document.querySelectorAll(".row__posters");
  // const row = document.querySelector(".row");
  const handleScrollLeft = () => {
    rowPosters[id].scrollBy({
      left: "500",
    });
  };
  const handleScrollRight = () => {
    rowPosters[id].scrollBy({
      left: "-500",
    });
  };
  const matches = useMediaQuery("(max-width: 620px)");
  useEffect(() => {
    if (matches) {
      setMobile(false);
    } else {
      setMobile(true);
    }
  }, [matches, []]);
  return (
    <div
      className="row"
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      <h2>{title}</h2>

      <div className="row__posters snaps-inline">
        {isShown && mobile && (
          <button
            type="button"
            class={`backArrow ${isLarge && "backArrowLarge"}`}
            aria-label="Prev"
            title="Prev"
            onClick={handleScrollRight}
          >
            <ArrowBackIosIcon className="Arrow" />
          </button>
        )}
        {movies.map((movie) => {
          if (movie.backdrop_path) {
            return (
              <div
                key={movie.id}
                className={`row__posterDiv ${isLarge && "row__posterLarge"} `}
                onClick={handleButtonClick}
              >
                <ProgressiveImage
                  src={`${base_url}${
                    isLarge ? movie.backdrop_path : movie.poster_path
                  }`}
                  placeholder=""
                  delay={260}
                  // threshold={[0]}
                >
                  {(src, loading) => {
                    return loading ? (
                      placeholder
                    ) : (
                      <img
                        src={src}
                        alt="an Image"
                        loading="lazy"
                        className="face face1"
                      />
                    );
                  }}
                </ProgressiveImage>

                <div className="face face2">
                  <ul>
                    <li onClick={() => handleClick(movie)}>
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          alignItems: "center",
                        }}
                      >
                        <PlayCircleOutlineIcon />
                        Watch trailer
                      </div>
                    </li>
                    <Link className="rowDetails" to={`/movie/${movie.id}`}>
                      <li>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <InfoIcon />
                          Show details
                        </div>
                      </li>
                    </Link>
                  </ul>
                </div>
              </div>
            );
          }
        })}
        {isShown && mobile && (
          <button
            type="button"
            className="forwardArrow"
            aria-label="Next"
            title="Next"
            onClick={handleScrollLeft}
          >
            <ArrowForwardIosIcon className="Arrow" />
          </button>
        )}
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
