import React, { useEffect, useState } from "react";
import { getFirestore, collection, addDoc, getDocs, getDoc, query, where, doc } from "firebase/firestore";
import app from "../utils/firebase"; // Firebase initialization
import "../css/recipeDetail.css"; // Import the CSS file
import backArrow from "../assets/backspace.png";

const db = getFirestore(app);
const reviewsCollection = collection(db, "reviews");

const RecipeDetail = ({ user, id, showDetail, setHomeSearch ,setSelectedRecipeId}) => {
  const [recipe, setRecipe] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const q = query(reviewsCollection, where("id", "==", id));
      const querySnapshot = await getDocs(q);
      const reviewsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewsList);
    } catch (error) {
      console.error("Error fetching reviews: ", error);
    }
  };

  const handleAddReview = async () => {
    if (!reviewText.trim()) return;
    try {
      console.log("id   defe       fe    ",user);
      await addDoc(reviewsCollection, {
        userId:user,
        id, // Fixed field name
        text: reviewText,
        createdAt: new Date(),
      });
      setReviewText("");
      fetchReviews(); // Refresh reviews after adding a new one
    } catch (error) {
      console.error("Error adding review: ", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]); // Ensure fetchReviews runs when 'id' changes

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, "recipes", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRecipe(docSnap.data());
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching recipe: ", error);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      {/* Back Button */}
      <button
        className="back-button"
        onClick={() => {
          showDetail(null); // Clear the selected recipe
          setHomeSearch(true);
          setSelectedRecipeId(null) // Set homeSearch to true when going back
        }}
      >
        <img src={backArrow} alt="Back" className="back-arrow-icon" />
      </button>

      {/* Main Content */}
      <div className="content-wrapper">
        <div className="text-section">
          <h1 className="heading">{recipe.recipeName}</h1>
          <p className="section calories">
            <strong>Calories:</strong> {recipe.calorieCount}
          </p>
        </div>
        <div className="image-section">
          <img src={recipe.photos} alt={recipe.recipeName} className="image" />
        </div>
      </div>

      {/* Ingredients and Procedure */}
      {/* Ingredients and Procedure */}
      <div className="recipe-sections">
      <div className="ingredients">
  <h2>Ingredients</h2>
  {recipe.ingredients
    ?.split(/[,–]/) // Split on '-' or ',' symbols
    .map((ingredient, index) => (
      <p key={index} className="gold-index">
        <span className="index">{index + 1}.</span> {ingredient.trim()}
      </p>
    ))}
</div>

<div className="procedure">
  <h2>Procedure</h2>
  {recipe.procedure
    ?.split(/\d+\./) // Split at numeric indexing (e.g., "1.", "2.")
    .filter((step) => step.trim() !== "") // Remove empty steps
    .map((step, index) => {
      const [title, ...details] = step.split(":"); // Split into title and details at ':'
      return (
        <div key={index} className="gold-index">
          <p>
            <span className="index">{index + 1}.</span> {title.trim()}
          </p>
          {details.length > 0 && (
            <p className="details">{details.join(":").trim()}</p> // Render the rest after ':'
          )}
        </div>
      );
    })}
</div>

      </div>

      {/* Tags Section */}
      <div className="tags-section">
  <h3>Tags</h3>
  <div className="tags-container">
    {recipe.tags && recipe.tags.length > 0 ? (
      recipe.tags.map((tag, index) => (
        <span key={index} className="tag-box">
          {tag.trim()}
        </span>
      ))
    ) : (
      <p>No tags available</p>
    )}
  </div>
</div>

    
      <div className="addReview">
        <div className="addReview-top">
          <h2>Add a Review</h2>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
          />
          <button onClick={handleAddReview}>Submit Review</button>
        </div>
        <div className="addReview-bottom">
  <h3>Reviews</h3>
  <div className="allR">
  {reviews.length > 0 ? (
   
    reviews.map((review, index) => (
      <div key={`${review.id}-${index}`} className="review">
        <p>{review.text}</p>
      </div>
    ))
  ) : (
    <p>No reviews yet. Be the first to add one!</p>
  )}
  </div>
</div>
</div>
    </div>
  );
};

export default RecipeDetail;
