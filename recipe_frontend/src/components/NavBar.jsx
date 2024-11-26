import React, { useState, useEffect } from "react";
import profile from "../assets/profile.png";
import plus from "../assets/plus.png";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import cb from '../assets/cookbook.png';
import { useNavigate } from 'react-router-dom';

function NavBar({ onPlusClick , onUserClick , onLogoClick }) {
    const [userImage, setUserImage] = useState(null);
    const [username, setUsername] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        // Get the current user and fetch profile details from Firestore
        const auth = getAuth();
        const currentUser = auth.currentUser;
        setUser(currentUser);

        if (currentUser) {
            const firestore = getFirestore();
            const userDoc = doc(firestore, "user", currentUser.uid);

            getDoc(userDoc)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.data();
                        setUserImage(userData.profileImage || profile); // Fallback to default image
                        setUsername(userData.firstname+" "+userData.lastname || "Guest"); // Fallback to "Guest" if no username
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data", error);
                });
        }
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSignOut = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                // Clear user data on sign out
                setUser(null);
                setUserImage(null);
                setUsername("");
                alert("You have successfully signed out!");
            })
            .catch((error) => {
                console.error("Sign out error", error);
            });
    };

    return (
        <div className="nav">
            <div className="logo">
                <img src={cb} alt="logo" onClick={onLogoClick} style={{cursor:"pointer"}} />
            </div>
            <div className="menu">
                {user ? (
                    <>
                        <img
                            src={userImage || profile} // Use the user image or a default image
                            alt="Profile"
                            style={{ cursor: "pointer", borderRadius: "50%" }}
                            onClick={toggleDropdown}
                        />
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <ul>
                                    <li onClick={() => { onUserClick(); toggleDropdown();}} style={{ cursor: "pointer" }}>
                                        <img
                                            src={userImage || profile} // Use the user image or a default image
                                            alt="Profile"
                                            style={{ borderRadius: "50%" , display: "inline-block" }}
                                        />
                                        <span style={{display: "inline-block",position:"relative",bottom:"10px",left:"10px"}}>{username}</span>
                                    </li>
                                    <li onClick={() => { handleSignOut(); toggleDropdown();}}>
                                        <button >Sign Out</button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <img
                            src={profile} // Use the user image or a default image
                            alt="Profile"
                            style={{ cursor: "pointer", borderRadius: "50%" }}
                            onClick={toggleDropdown}
                        />
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <ul>
                                    <li>
                                        <button onClick={() => { navigate('/'); toggleDropdown();}}>Sign In</button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </>
                )}
                <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M43.3202 34.3633C42.2363 32.4961 40.6249 27.2129 40.6249 20.3125C40.6249 16.1685 38.9787 12.1942 36.0485 9.26396C33.1182 6.3337 29.1439 4.6875 24.9999 4.6875C20.8559 4.6875 16.8816 6.3337 13.9514 9.26396C11.0211 12.1942 9.37493 16.1685 9.37493 20.3125C9.37493 27.2148 7.76165 32.4961 6.67767 34.3633C6.40085 34.838 6.2541 35.3773 6.25222 35.9268C6.25033 36.4763 6.39337 37.0166 6.66692 37.4931C6.94047 37.9697 7.33485 38.3658 7.8103 38.6413C8.28574 38.9168 8.82542 39.0621 9.37493 39.0625H17.3456C17.7061 40.8265 18.6648 42.4118 20.0596 43.5503C21.4543 44.6889 23.1995 45.3107 24.9999 45.3107C26.8004 45.3107 28.5456 44.6889 29.9403 43.5503C31.335 42.4118 32.2937 40.8265 32.6542 39.0625H40.6249C41.1743 39.0618 41.7137 38.9162 42.1889 38.6406C42.6641 38.3649 43.0582 37.9688 43.3315 37.4923C43.6048 37.0158 43.7477 36.4756 43.7457 35.9263C43.7437 35.3769 43.597 34.8378 43.3202 34.3633ZM24.9999 42.1875C24.0308 42.1872 23.0856 41.8865 22.2945 41.3269C21.5033 40.7673 20.905 39.9762 20.582 39.0625H29.4179C29.0949 39.9762 28.4966 40.7673 27.7054 41.3269C26.9142 41.8865 25.969 42.1872 24.9999 42.1875ZM9.37493 35.9375C10.8788 33.3516 12.4999 27.3594 12.4999 20.3125C12.4999 16.9973 13.8169 13.8179 16.1611 11.4737C18.5053 9.12946 21.6847 7.8125 24.9999 7.8125C28.3151 7.8125 31.4946 9.12946 33.8388 11.4737C36.183 13.8179 37.4999 16.9973 37.4999 20.3125C37.4999 27.3535 39.1171 33.3457 40.6249 35.9375H9.37493Z" fill="white"/>
                </svg>
                <img
                    src={plus}
                    alt="Add"
                    onClick={onPlusClick}
                    style={{ cursor: "pointer" ,filter: "sepia(1) hue-rotate(-50deg) saturate(10)" }}
                />
            </div>
        </div>
    );
}

export default NavBar;
