import React from "react";
import "./style/Footer.css";

function Footer() {
  return (
    <div>
      <div className="footer">
        <div className="contactMe">Contact me😁</div>
        <div className="contact_lists">
          <a
            href="https://www.facebook.com/dilshod.djalilov.12"
            target="_blank"
            class="contact-details"
          >
            <i class="fab fa-facebook-square">Facebook</i>
          </a>
          <a
            href="https://github.com/Hamburger09"
            target="_blank"
            class="contact-details"
          >
            <i class="fab fa-github">GitHub</i>
          </a>
          <a
            href="mailto:akhmedov20092004@gmail.com"
            target="_blank"
            class="contact-details"
          >
            <i class="fas fa-at">Email</i>
          </a>
          <a href="tel:+998-99-849-53-31" class="contact-details">
            <i class="fas fa-mobile-alt">Call Me</i>
          </a>
        </div>
      </div>
      <footer>
        <p>**This is a Netflix Clone!**</p>
        <div className="created__dilshod">
          <p>©️ Created by Dilshod</p>
          <img
            className="dilshod__cube"
            src="https://cdn-icons-png.flaticon.com/512/663/663627.png"
            alt=""
          />
        </div>
      </footer>
    </div>
  );
}

export default Footer;
