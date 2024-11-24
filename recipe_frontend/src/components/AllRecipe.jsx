import { getFirestore, collection, getDocs } from "firebase/firestore";
import RecipeDetail from "./RecipeDetail";
import React, { useEffect, useState, useCallback } from "react";
import app from "../utils/firebase"; // Adjust the path to your Firebase initialization file
import "../css/allReciipe.css";
import likeIcon from "../assets/like.png";
import updateFieldByDocumentField from "../utils/updateLike";

const db = getFirestore(app);

export const fetchRecipes = async () => {
  try {
    const recipesCollection = collection(db, "recipes");
    const snapshot = await getDocs(recipesCollection);

    // Extract data from each document
    const recipes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

const AllRecipe = ({ homeSearch, user }) => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({}); // Track the current image index for each recipe

  const like = useCallback((userId) => {
    console.log(userId);
    updateFieldByDocumentField("userId", userId, "like", "n");
  }, []);

  useEffect(() => {
    const loadRecipes = async () => {
      const data = await fetchRecipes();
      setRecipes(data);

      // Initialize the current image index for each recipe
      const initialIndexes = {};
      data.forEach((recipe) => {
        initialIndexes[recipe.id] = 0;
      });
      setCurrentImageIndex(initialIndexes);
    };

    loadRecipes();
  }, []);

  const handleNextImage = useCallback((recipeId, photos) => {
    setCurrentImageIndex((prevState) => ({
      ...prevState,
      [recipeId]: (prevState[recipeId] + 1) % photos.length, // Cycle through photos
    }));
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevState) => {
        const newState = { ...prevState };
        recipes.forEach((recipe) => {
          if (recipe.photos && recipe.photos.length > 1) {
            newState[recipe.id] = (prevState[recipe.id] + 1) % recipe.photos.length;
          }
        });
        return newState;
      });
    }, 2000); // Auto-slide every 2 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [recipes]);

  if (selectedRecipeId) {
    return (
      <RecipeDetail
        showDetail={setSelectedRecipeId}
        id={selectedRecipeId}
        user={user}
        setHomeSearch={homeSearch}
        setSelectedRecipeId={setSelectedRecipeId}
      />
    );
  }

  return (
    <div className="grid-container">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="card">
          {/* Like Button */}
          <img
            className="like"
            src={likeIcon}
            alt="Like"
            onClick={(event) => {
              event.stopPropagation(); // Prevent event bubbling
              like(recipe.userId); // Call the like function
            }}
          />
          {/* Slideshow */}
          <img
            src={recipe.photos[currentImageIndex[recipe.id] || 0]} // Show current image
            alt={recipe.recipeName}
            className="image"
            onClick={(event) => {
              event.stopPropagation(); // Prevent event bubbling
              handleNextImage(recipe.id, recipe.photos); // Change image on click
            }}
          />
          {/* Recipe Title */}
          <h3
            className="t"
            onClick={() => {
              setSelectedRecipeId(recipe.id);
              setUserId(recipe.userId);
            }}
          >
            {recipe.recipeName}
          </h3>
          <hr className="all-recipe-hr" />
        </div>
      ))}
    </div>
  );
};

export default AllRecipe;
