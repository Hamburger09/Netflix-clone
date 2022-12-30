import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./style/movieView.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import Footer from "./Footer";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ProgressiveImage from "react-progressive-graceful-image";

const base_url = "https://image.tmdb.org/t/p/original/";

const MovieView = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState({});
  const [path, setPath] = useState("");
  const [genres, setGenres] = useState("");
  const [companies, setCompanies] = useState("");

  const matches = useMediaQuery("(max-width: 620px)");
  useEffect(() => {
    if (matches) {
      setPath(base_url + movieDetails?.poster_path);
    } else {
      setPath(base_url + movieDetails?.backdrop_path);
    }
  }, [matches, []]);

  useEffect(() => {
    async function getIdMovie() {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=14bf041fa050b017db724739e0e27663&language=en-US`
      );
      const data = await response.json();
      setGenres(data.genres);
      setCompanies(data.production_companies);
      setMovieDetails(data);
    }
    getIdMovie();
  }, [id]);
  const placeholder = (
    <div style={{ minWidth: "401px", height: "578px" }} className="place" />
  );

  return (
    <>
      <div style={{ width: "100%", height: "100%" }}>
        <div
          className="movieBackground"
          style={{
            backgroundImage: `linear-gradient(180.43deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0, 0.1) 100%),url(${path})`,
          }}
        >
          <h1>{movieDetails.original_title}</h1>
        </div>

        <div className="movieView">
          <ProgressiveImage src={base_url + movieDetails.poster_path}>
            {(src, loading) => {
              return loading ? placeholder : <img src={src} alt="an Image" />;
            }}
          </ProgressiveImage>
          <div className="imageOverview">
            <h2>Rating: {movieDetails.vote_average}</h2>
            <h3>{movieDetails.release_date}</h3>
            <p>{movieDetails.overview}</p>
            <div className="genreList">
              Genres:
              {genres ? (
                genres.map((genre) => (
                  <ul key={genre.id}>
                    <li className="genre"> {genre.name}</li>
                  </ul>
                ))
              ) : (
                <></>
              )}
            </div>

            <a href={movieDetails.homepage} target="_blank">
              More details
            </a>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default MovieView;
