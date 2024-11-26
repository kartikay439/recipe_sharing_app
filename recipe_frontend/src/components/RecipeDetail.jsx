import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import "../css/recipeDetail.css"; // Import the CSS file
import backArrow from "../assets/backspace.png";
import likeIcon from "../assets/like.png";
import follower from "../assets/followers.png";
import { db } from "../utils/firebase";

const reviewsCollection = collection(db, "reviews");
const followersCollection = collection(db, "followers");

const RecipeDetail = ({
  user, // Current user ID
  id, // Recipe document ID
  showDetail,
  setHomeSearch,
  setSelectedRecipeId,
}) => {
  const [recipe, setRecipe] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [like, setLike] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false); // Follow status
  const [followersCount, setFollowersCount] = useState(0); // Followers count

  // Fetch Reviews
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

  // Add Review
  const handleAddReview = async () => {
    if (!reviewText.trim()) return;
    try {
      await addDoc(reviewsCollection, {
        userId: user,
        id,
        text: reviewText,
        createdAt: new Date(),
      });
      // Fetch the user's document
      const docRef = doc(db, "recipes", id);
      const docSnap = await getDoc(docRef);
      const userRef = doc(db, "user", docSnap.data().userId); // Assuming 'user' is the userID
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Increment reviewCount
        const userData = userSnap.data();
        const currentReviewCount = userData.reviewCount || 0;

        await updateDoc(userRef, {
          reviewCount: currentReviewCount + 1,
        });
      } else {
        console.error("User document not found for userID:", user);
      }
      setReviewText("");
      fetchReviews(); // Refresh reviews after adding a new one
    } catch (error) {
      console.error("Error adding review: ", error);
    }
  };

  // Fetch Recipe
  const fetchRecipe = async () => {
    try {
      const docRef = doc(db, "recipes", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const recipeData = docSnap.data();
        setRecipe(recipeData);
        setLike(recipeData.like || 0);
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error fetching recipe: ", error);
    }
  };

  // Handle Like
  const handleLike = async () => {
    try {
      const recipeRef = doc(db, "recipes", id);
      const newLikes = like + 1;

      await updateDoc(recipeRef, { like: newLikes });
      setLike(newLikes); // Update local state
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const checkFollowerStatus = async () => {
    try {
      const followerQuery = query(
        followersCollection,
        where("userId", "==", recipe.userId), // Recipe uploader ID
        where("followerId", "==", user) // Current user ID
      );
      const followerSnapshot = await getDocs(followerQuery);
      setIsFollowing(!followerSnapshot.empty);

      const followersQuery = query(
        followersCollection,
        where("userId", "==", recipe.userId)
      );
      const followersSnapshot = await getDocs(followersQuery);
      setFollowersCount(followersSnapshot.size);
    } catch (error) {
      console.error("Error checking follower status: ", error);
    }
  };

  // Follow/Unfollow
  const handleFollow = async () => {
    try {
      if (isFollowing) {
        // Unfollow
        const followerQuery = query(
          followersCollection,
          where("userId", "==", recipe.userId),
          where("followerId", "==", user)
        );
        const followerSnapshot = await getDocs(followerQuery);

        // Delete the follow document
        followerSnapshot.forEach((doc) => deleteDoc(doc.ref));

        setIsFollowing(false);
        setFollowersCount((count) => count - 1);
      } else {
        // Follow
        await addDoc(followersCollection, {
          userId: recipe.userId, // Recipe uploader ID
          followerId: user, // Current user ID
        });

        setIsFollowing(true);
        setFollowersCount((count) => count + 1);
      }
    } catch (error) {
      console.error("Error updating follow status: ", error);
    }
  };

  // Fetch recipe and follow status
  useEffect(() => {
    fetchRecipe();
  }, [id]);

  useEffect(() => {
    if (recipe?.userId) {
      checkFollowerStatus();
    }
  }, [recipe]);

  // Image Slider
  useEffect(() => {
    if (recipe?.photos && recipe.photos.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % recipe.photos.length
        );
      }, 3000); // Change the image every 3 seconds
      return () => clearInterval(interval);
    }
  }, [recipe]);

  // Fetch reviews when ID changes
  useEffect(() => {
    fetchReviews();
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
          showDetail(null);
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
          {/* Actions */}
          <div className="actions">
            <img
              src={likeIcon}
              alt="Like"
              className="like-icon"
              onClick={handleLike}
            />
            <span className="like-count">{like} likes</span>

            <img
              src={follower}
              alt="Like"
              className="followers"
            />
            <span className="like-count">{followersCount} followers</span>

          </div>
          <div className="follow-section">
            <button onClick={handleFollow} className="follow-button">
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
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
              <p>No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
