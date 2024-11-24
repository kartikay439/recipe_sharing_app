import React, { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import "../css/profilePage.css"; 
import { db } from '../utils/firebase';
import insta from '../assets/social.png';
import fb from '../assets/facebook.png';
import pin from '../assets/logo.png';
import RecipeDetail from './RecipeDetail'; // Import the RecipeDetail component
import profile from "../assets/profile.png";

function profilePage({ userId }) {
    const [userData, setUserData] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecipeId, setSelectedRecipeId] = useState(null); // State for selected recipe

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await getDoc(doc(db, "user", userId));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                } else {
                    console.error("User not found");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const fetchUserRecipes = async () => {
            try {
                const q = query(collection(db, "recipes"), where("userId", "==", userId));
                const querySnapshot = await getDocs(q);
                const recipesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setRecipes(recipesData);
            } catch (error) {
                console.error("Error fetching user recipes:", error);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            await fetchUserData();
            await fetchUserRecipes();
            setLoading(false);
        };

        fetchData();
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>User not found</div>;
    }

    // If a recipe is selected, show the RecipeDetail component
    if (selectedRecipeId) {
        return (
            <RecipeDetail
                id={selectedRecipeId}
                showDetail={setSelectedRecipeId} // Function to clear the selected recipe
                setHomeSearch={() => setSelectedRecipeId(null)} // Go back to the profile page
            />
        );
    }

    // Main profile page content
    return (
        <div className="profile-page">
            <div className="userdetail">
                <img src={userData.profileImage || profile} alt={`${userData.firstname} ${userData.lastname}`} className="profile-image" />
                <div className="profile-header">
                    <h1>{userData.firstname} {userData.lastname}</h1>
                </div>
                <div className="social-links">
                    <a href={userData.facebook || null} target="_blank" rel="noreferrer">
                        <img className="sl" src={fb} alt="Facebook" />
                    </a>
                    <a href={userData.instagram || null} target="_blank" rel="noreferrer">
                        <img className="sl" src={insta} alt="Instagram" />
                    </a>
                    <a href={userData.pinterest || null} target="_blank" rel="noreferrer">
                        <img className="sl" src={pin} alt="Pinterest" />
                    </a>
                </div>
                <div className="user-bio">
                    <p>{userData.about || "No bio available"}</p>
                </div>
            </div>
            <div className="stats">
                <div>
                    <h2>{userData.like || 0}</h2>
                    <p>Likes</p>
                </div>
                <div>
                    <h2>{userData.followers || 0}</h2>
                    <p>Followers</p>
                </div>
                <div>
                    <h2>{userData.reviews || 0}</h2>
                    <p>Reviews</p>
                </div>
            </div>

            <div className="recipes-section">
                <h2>Recipes Posted</h2>
                <div className="recipes-list">
                    {recipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="recipe-card"
                            onClick={() => setSelectedRecipeId(recipe.id)} // Handle click event
                        >
                            <img src={recipe.photos?.[0]} alt={recipe.recipeName} />
                            <h3>{recipe.recipeName}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default profilePage;
