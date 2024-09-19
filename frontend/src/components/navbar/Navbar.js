import React from 'react';
import '../../styles/Navbar.css'; // Import the corresponding CSS file for Navbar styles
import { AiOutlineMenu } from "react-icons/ai";


const Navbar = ({user, toggleMenu}) => {
    return (
        <nav className="navbar">
            <div className="nav-flex">
                <h1>Welcome, {user}</h1>
                <div className="menu-toggle menu-icon" onClick={() => toggleMenu()}>
                    <AiOutlineMenu />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
