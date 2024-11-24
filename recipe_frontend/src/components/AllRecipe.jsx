import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import app from "../utils/firebase"; // Adjust to your Firebase initialization file
import RecipeDetail from "./RecipeDetail";
import likeIcon from "../assets/like.png";
import "../css/allReciipe.css";
import updateFieldByDocumentField from "../utils/updateLike";

const db = getFirestore(app);

// Fetch recipes from Firestore
const fetchRecipes = async () => {
  try {
    const recipesCollection = collection(db, "recipes");
    const snapshot = await getDocs(recipesCollection);

    // Extract data from each document
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

const AllRecipe = ({ searchQuery, homeSearch, user }) => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({}); // Track the current image index for each recipe

  // Like functionality
  const like = useCallback((userId) => {
    console.log("Liking user:", userId);
    updateFieldByDocumentField("userId", userId, "like", "n");
  }, []);

  // Fetch recipes and initialize current image indexes
  useEffect(() => {
    const loadRecipes = async () => {
      const data = await fetchRecipes();
      setRecipes(data);
      setFilteredRecipes(data);

      // Initialize image indexes
      const initialIndexes = {};
      data.forEach((recipe) => {
        initialIndexes[recipe.id] = 0;
      });
      setCurrentImageIndex(initialIndexes);
    };

    loadRecipes();
  }, []);

  // Filter recipes based on search query
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = recipes.filter(
        (recipe) =>
          recipe.recipeName?.toLowerCase().includes(query) ||
          recipe.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes);
    }
  }, [searchQuery, recipes]);

  // Auto-slide functionality for recipe images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevState) => {
        const newState = { ...prevState };
        recipes.forEach((recipe) => {
          if (recipe.photos && recipe.photos.length > 1) {
            newState[recipe.id] =
              (prevState[recipe.id] + 1) % recipe.photos.length;
          }
        });
        return newState;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [recipes]);

  // Handle next image on modifier key press
  const handleImageClick = useCallback(
    (recipeId, event) => {
      if (event.shiftKey) {
        // Cycle through photos on Shift key press
        setCurrentImageIndex((prevState) => ({
          ...prevState,
          [recipeId]: (prevState[recipeId] + 1) % recipes.find(recipe => recipe.id === recipeId).photos.length,
        }));
      } else {
        // Redirect to recipe details otherwise
        setSelectedRecipeId(recipeId);
      }
    },
    [recipes]
  );

  // Render RecipeDetail if a recipe is selected
  if (selectedRecipeId) {
    return (
      <RecipeDetail
        id={selectedRecipeId}
        showDetail={setSelectedRecipeId}
        homeSearch={homeSearch}
        user={user}
      />
    );
  }

  return (
    <div className="grid-container">
      {filteredRecipes.map((recipe) => (
        <div key={recipe.id} className="card">
          {/* Like Button */}
          <img
            className="like"
            src={likeIcon}
            alt="Like"
            onClick={(event) => {
              event.stopPropagation();
              like(recipe.userId);
            }}
          />
          {/* Slideshow or Redirect */}
          <img
            src={recipe.photos[currentImageIndex[recipe.id] || 0]}
            alt={recipe.recipeName}
            className="image"
            onClick={(event) => {
              event.stopPropagation();
              handleImageClick(recipe.id, event);
            }}
          />
          {/* Recipe Title */}
          <h3
            className="t"
            onClick={() => {
              setSelectedRecipeId(recipe.id);
            }}
          >
            {recipe.recipeName}
          </h3>
          <hr className="all-recipe-hr" />
        </div>
      ))}
      {filteredRecipes.length === 0 && <p>No recipes to display</p>}
    </div>
  );
};

export default AllRecipe;
