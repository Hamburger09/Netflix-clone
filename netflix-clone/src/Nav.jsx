import React, { useState, useEffect } from "react";
import "./style/Nav.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

function Nav({ searchText, setSearchText, setSearch }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    setLoading(true);
    navigate("/search");
    if (searchText) {
      async function getMovies() {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=14bf041fa050b017db724739e0e27663&language=en-US&query=${searchText}&page=1&include_adult=false`
        );
        const data = await response.json();
        setSearch(data.results);
        setLoading(false);
      }
      getMovies();
    }
  };
  const param = useParams();
  const refreshPage = () => {
    window.location.reload(false);
  };

  const updateSearchText = (e) => {
    setSearchText(e.target.value);
    setTimeout(() => {
      navigate("/search");
    }, 500);
  };
  const [show, handleShow] = useState(false);
  // console.log(param);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 60) {
        handleShow(true);
      } else handleShow(false);
    });
    return window.removeEventListener("scroll", () => {});
  }, []);
  return (
    <div className={`nav ${show && "nav__black"}`}>
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      <Link to="/">
        <img
          className="nav__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Logonetflix.png/1200px-Logonetflix.png"
          alt="Netflix Logo"
          // onClick={param && refreshPage}
        />
      </Link>
      <form action="search" className="searchForm">
        <div className="searchIcon">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search"
            className="searchInput"
            value={searchText}
            onChange={updateSearchText}
          />
        </div>
        <button type="submit" onClick={handleClick}>
          Search
        </button>
      </form>
      {/* <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
        <img
          className="nav__avatar"
          src="https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/3170728/emojis-clipart-md.png"
          alt="Blue smile"
        />
      </a> */}
    </div>
  );
}

export default Nav;
