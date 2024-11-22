import { getFirestore, collection, getDocs } from "firebase/firestore";
import RecipeDetail from "./RecipeDetail";
import React, { useEffect, useState } from "react";
import app from "../utils/firebase"; // Adjust the path to your Firebase initialization file
import "../css/allReciipe.css"
import m from '../assets/like.png'
import updateFieldByDocumentField from "../utils/updateLike"

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




const AllRecipe = ({ homeSearch }) => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);


function like(userId){
  console.log(userId)
  updateFieldByDocumentField("userId",userId,"like","n")
}

  useEffect(() => {
    const loadRecipes = async () => {
      const data = await fetchRecipes();
      setRecipes(data);
    };

    loadRecipes();
  }, []);

  if (selectedRecipeId) {
    return (
      <RecipeDetail
        showDetail={setSelectedRecipeId}
        id={selectedRecipeId}
        homeSearch={homeSearch(false)}
        setHomeSearch={homeSearch}
      />
    );
  }

  return (
    <div className="grid-container">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="card"
          >
          <img  className="like" src={m} alt="" onClick={(event) => {
      event.stopPropagation(); // Prevent event bubbling
      like(recipe.userId); // Call the like function
    }}/>
          <img src={recipe.photos[0]} alt={recipe.recipeName} className="image"  onClick={() => setSelectedRecipeId(recipe.id)}></img>
          <h3 className="title" onClick={() => setSelectedRecipeId(recipe.id)}>{recipe.recipeName} </h3>
          <hr  className="all-recipe-hr"/>
        </div>
      ))}
    </div>
  );
};

export default AllRecipe;
