import React, { useState, useEffect } from "react";
import { instance } from "./axios";
import "./style/row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

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
  console.log(movies);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
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
    <div className="row">
      <h2>{title}</h2>

      <div className="row__posters">
        {movies.map((movie) => (
          <img
            loading="lazy"
            key={movie.id}
            onClick={() => handleClick(movie)}
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
        ))}
      </div>
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}
// class Row extends React.Component {
//     render() {
//         return (
//             <div>
//                 <h2>{this.props.title}</h2>
//             </div>
//         )
//     }

// }

export default Row;
