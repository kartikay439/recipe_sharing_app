import React, { useEffect, useState } from "react";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  doc, 
  updateDoc 
} from "firebase/firestore";
import app from "../utils/firebase"; // Firebase initialization
import "../css/recipeDetail.css"; // Import the CSS file
import backArrow from "../assets/backspace.png";
import likeIcon from "../assets/like.png";

const db = getFirestore(app);
const reviewsCollection = collection(db, "reviews");
const likesCollection = collection(db, "likes");

const RecipeDetail = ({ user, id, showDetail, setHomeSearch, setSelectedRecipeId }) => {
  const [recipe, setRecipe] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

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
      await addDoc(reviewsCollection, {
        userId: user,
        id,
        text: reviewText,
        createdAt: new Date(),
      });
      setReviewText("");
      fetchReviews(); // Refresh reviews after adding a new one
    } catch (error) {
      console.error("Error adding review: ", error);
    }
  };

  const handleLike = async () => {
    if (hasLiked) {
      console.log("User has already liked this recipe.");
      return;
    }

    try {
      // Add like record to the `likes` collection
      await addDoc(likesCollection, {
        userId: user,
        recipeId: id,
        likedAt: new Date(),
      });

      // Increment the like count on the `recipes` document
      const recipeRef = doc(db, "recipes", id);
      const newLikeCount = likeCount + 1;
      await updateDoc(recipeRef, { like: newLikeCount });

      setLikeCount(newLikeCount); // Update local state
      setHasLiked(true); // Mark as liked
    } catch (error) {
      console.error("Error liking the recipe: ", error);
    }
  };

  const checkIfUserLiked = async () => {
    try {
      const q = query(likesCollection, where("userId", "==", user), where("recipeId", "==", id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setHasLiked(true);
      }
    } catch (error) {
      console.error("Error checking if user liked the recipe: ", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, "recipes", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const recipeData = docSnap.data();
          setRecipe(recipeData);
          setLikeCount(recipeData.like || 0); // Set initial like count
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching recipe: ", error);
      }
    };

    fetchRecipe();
    checkIfUserLiked(); // Check if the user has already liked the recipe
  }, [id]);

  useEffect(() => {
    if (recipe?.photos && recipe.photos.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % recipe.photos.length);
      }, 6000); // Change the image every 3 seconds
      return () => clearInterval(interval);
    }
  }, [recipe]);

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
          setSelectedRecipeId(null);
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
          {/* Like Section */}
          <div className="actions">
            <img
              src={likeIcon}
              alt="Like"
              className={`like-icon ${hasLiked ? "liked" : ""}`}
              onClick={handleLike}
            />
            <span className="like-count">{likeCount} likes</span>
          </div>
        </div>
        <div className="image-section">
          {recipe.photos && recipe.photos.length > 0 ? (
            <img
              src={recipe.photos[currentImageIndex]}
              alt={`Slide ${currentImageIndex + 1}`}
              className="image"
            />
          ) : (
            <p>No images available</p>
          )}
        </div>
      </div>

      {/* Ingredients and Procedure */}
      <div className="recipe-sections">
        <div className="ingredients">
          <h2>Ingredients</h2>
          {recipe.ingredients
            ?.split(/[,–]/)
            .map((ingredient, index) => (
              <p key={index} className="gold-index">
                <span className="index">{index + 1}.</span> {ingredient.trim()}
              </p>
            ))}
        </div>

        <div className="procedure">
          <h2>Procedure</h2>
          {recipe.procedure
            ?.split(/\d+\./)
            .filter((step) => step.trim() !== "")
            .map((step, index) => {
              const [title, ...details] = step.split(":");
              return (
                <div key={index} className="gold-index">
                  <p>
                    <span className="index">{index + 1}.</span> {title.trim()}
                  </p>
                  {details.length > 0 && (
                    <p className="details">{details.join(":").trim()}</p>
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

      {/* Reviews Section */}
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
