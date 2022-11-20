import React, { useState, useEffect } from "react";
import "./style/Nav.css";

function Nav() {
  const [show, handleShow] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        handleShow(true);
      } else handleShow(false);
    });
    return window.removeEventListener("scroll", () => {});
  }, []);
  return (
    <div className={`nav ${show && "nav__black"}`}>
      <a href="https://www.netflix.com/" target={"_blank"}>
        <img
          className="nav__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Logonetflix.png/1200px-Logonetflix.png"
          alt="Netflix Logo"
        />
      </a>
      <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
        <img
          className="nav__avatar"
          src="https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/3170728/emojis-clipart-md.png"
          alt="Blue smile"
        />
      </a>
    </div>
  );
}

export default Nav;
