import React, { useEffect, useRef, useState } from "react";
import Style from "../../css/nav.module.css";

import { MdOutlineLocalPhone } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";

import logo from "../../assets/class_suru_logo.png";
import Button from "../Button/Button";
import { Link } from "react-router-dom";
import Menu from "./Menu";

import { MdMenu, MdClose } from "react-icons/md";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const menuRef = useRef();
  useEffect(() => {
    const toggleSidebar = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        // console.log(menuRef.current);
      }
    };
    document.addEventListener("mousedown", toggleSidebar);
    return () => {
      document.removeEventListener("mousedown", toggleSidebar);
    };
  }, []);
  return (
    <nav className={Style.navContainer}>
      <div className={Style.navUpper}>
        <div className={Style.nav}>
          <div className={Style.contactOptionContainer}>
            <a className={Style.contactOption} href="#">
              <MdOutlineLocalPhone className={Style.contactIcon} />
              <div className={Style.contactText}>+91 9064895938</div>
            </a>
            <a className={Style.contactOption} href="#">
              <MdOutlineEmail className={Style.contactIcon} />
              <div className={Style.contactText}>classsuru22@gmail.com</div>
            </a>
          </div>

          <div className={Style.socials}>
            <a href="#" className={Style.socailsIcons}>
              <FaFacebookF />
            </a>
            <a href="#" className={Style.socailsIcons}>
              <FaXTwitter />
            </a>
            <a href="#" className={Style.socailsIcons}>
              <FaYoutube />
            </a>
            <a href="#" className={Style.socailsIcons}>
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className={Style.navLower}>
        <div className={Style.nav}>
          <div className={Style.logo}>
            <img className={Style.logoImg} src={logo} alt="class suru logo" />
            <div className={Style.logoText}>Class Suru</div>
          </div>
          <div
            className={`${Style.navLinks} ${
              menuOpen ? Style.active : Style.inactive
            }`}
            ref={menuRef}
          >
            <Link
              className={Style.navLink}
              to="/"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              className={Style.navLink}
              to="/about"
              onClick={() => setMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              className={Style.navLink}
              to="/services"
              onClick={() => setMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              className={Style.navLink}
              to="/courses"
              onClick={() => setMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              className={Style.navLink}
              to="/exam"
              onClick={() => setMenuOpen(false)}
            >
              Online Exam
            </Link>
          </div>
          <div className={Style.navButtons}>
            <Button
              text="Login/Signup"
              className={Style.navButton}
              isLink={true}
              link="/login"
            />
            <div className={Style.menuSection} id="menuSection">
              <div
                className={`${Style.menu} ${!menuOpen ? Style.open : ""}`}
                onClick={() => setMenuOpen(true)}
              >
                <MdMenu />
              </div>
              <div
                className={`${Style.close} ${menuOpen ? Style.open : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <MdClose />
              </div>
            </div>
            {/* <div className={Style.profile}>
              
            </div> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
