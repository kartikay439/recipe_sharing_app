// src/components/NavBar.jsx
import React from "react";
import cook from "../assets/cooking.png";
import profile from "../assets/profile.png";
import plus from "../assets/plus.png";

function NavBar({ onPlusClick ,onUserClick}) {
    return (
        <div className="nav" style={{backgroundColor:"black", height:"70px"}}>
            <div className="logo">
                <img src={cook} alt="Cooking" />
            </div>
            <div className="menu">
                <img onClick={onUserClick} src={profile} alt="Profile" />
                <img
                    src={plus}
                    alt="Add"
                    onClick={onPlusClick}
                    style={{ cursor: "pointer" }}
                />
            </div>
        </div>
    );
}

export default NavBar;
