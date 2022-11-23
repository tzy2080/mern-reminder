import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import LogOutBtn from './logOutBtn';
import '../css/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    const { loggedIn } = useContext(AuthContext);
    const [navbarActive, setNavbarActive] = useState(false);

    const navBarScroll = () => {
        if(window.scrollY >= 80) {
            setNavbarActive(true);
        } else {
            setNavbarActive(false);
        }
    };

    const navbar = () => {
        if (navbarActive) {
            return "navbar active navbar-expand-sm fixed-top"
        } else {
            if (window.screen.width < 768) {
                return "navbar navbar-expand-sm fixed-top mobile"
            } else {
                return "navbar navbar-expand-sm fixed-top"
            }
        }
    };

    const navbarBrand = () => {
        if (navbarActive) {
            if (window.screen.width < 768) {
                return "navbar-brand active"
            } else {
                return "navbar-brand active pl-3"
            }
        } else {
            if (window.screen.width < 768) {
                return "navbar-brand"
            } else {
                return "navbar-brand pl-3"
            }
        }
    };

    window.addEventListener('scroll', navBarScroll);

    return (
        <nav className={navbar()} id="navbar">
            <Link to="/" className={navbarBrand()}>Task Reminder</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <FontAwesomeIcon icon={faBars} className="navbar-toggler-icon"></FontAwesomeIcon>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    {
                        loggedIn === false && (
                            <>
                                <li className="nav-item">
                                    <Link to="/register" className="nav-link">Register</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link">login</Link>
                                </li>
                            </>
                        )
                    }
                    {
                        loggedIn === true && (
                            <>
                                <li className="nav-item">
                                    <Link to="/create" className="nav-link">Create reminder</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/reminders" className="nav-link">Reminder list</Link>
                                </li>
                                <li className="nav-item">
                                    <LogOutBtn />
                                </li>
                            </>
                        )
                    }
                </ul>
            </div>
        </nav>
    );
}
 
export default Navbar;