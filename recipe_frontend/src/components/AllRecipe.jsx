import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../utils/firebase"; // Adjust the path to your Firebase initialization file

const db = getFirestore(app);
import RecipeDetail from "./RecipeDetail";
import React, { useEffect, useState } from "react";

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

const AllRecipe = ({ homeSearch }) => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null); // Track selected recipe ID

  useEffect(() => {
    const loadRecipes = async () => {
      const data = await fetchRecipes();
      setRecipes(data);
    };

    loadRecipes();
  }, []);

  if (selectedRecipeId) {
    // Render RecipeDetail if a recipe is selected
    return (
      <RecipeDetail
        showDetail={setSelectedRecipeId}
        id={selectedRecipeId}
        homeSearch={homeSearch(false)} // This should be set to false when showing details
        setHomeSearch={homeSearch} // Pass the setHomeSearch function here
      />
    );
  }

  return (
    <div style={styles.gridContainer}>
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          style={styles.card}
          onClick={() => setSelectedRecipeId(recipe.id)} // Pass ID to RecipeDetail
        >
          <img src={recipe.photos[0]} alt={recipe.recipeName} style={styles.image} />
          <h3 style={styles.title}>{recipe.recipeName}</h3>
        </div>
      ))}
    </div>
  );
};

const styles = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    textAlign: "center",
    padding: "15px",
    cursor: "pointer",
    textDecoration: "none",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "4px",
  },
  title: {
    margin: "10px 0",
    fontSize: "18px",
    fontWeight: "bold",
  },
};

export default AllRecipe;
