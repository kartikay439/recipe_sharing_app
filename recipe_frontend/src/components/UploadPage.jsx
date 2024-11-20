import React, { useState } from 'react';
import '../css/uploadPage.css';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import app from "../utils/firebase.js";

// Initialize Firestore instance
const db = getFirestore(app);

// Function to upload a single document to Firestore
export const uploadSingleDocument = async (collectionName, documentId, data) => {
  try {
    const docRef = doc(db, collectionName, documentId); // Set the document ID
    await setDoc(docRef, data); // Upload the document
    console.log("Document uploaded successfully:", documentId);
  } catch (error) {
    console.error("Error uploading document:", error);
  }
};

function UploadPage({ selectedCategory, setShowUploadPage }) {
  const [photos, setPhotos] = useState([]); // Array of files to upload
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [procedure, setProcedure] = useState('');
  const [calorieCount, setCalorieCount] = useState('');
  const [nutritionValues, setNutritionValues] = useState('');
  const [tags, setTags] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]); // Array of uploaded file URLs
  const [uploading, setUploading] = useState(false);

  // Handle file selection
  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    setPhotos((prevPhotos) => [...prevPhotos, ...files.slice(0, 5 - prevPhotos.length)]);
  };

  // Handle adding a tag
  const handleTagAdd = () => {
    const newTag = document.getElementById("tagInput").value.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags((prevTags) => [...prevTags, newTag]);
      document.getElementById("tagInput").value = ""; // Clear the input
    }
  };

  // Upload a single file to Cloudinary
  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url; // Return the uploaded file URL
  };

  // Upload all selected photos
  const uploadAllFiles = async () => {
    if (photos.length === 0) {
      alert("No files to upload!");
      return;
    }

    setUploading(true);
    try {
      const urls = await Promise.all(photos.map((file) => uploadToCloudinary(file)));
      setUploadedUrls(urls);
      console.log("Uploaded File URLs:", urls);
      alert("All files uploaded successfully!");
      setPhotos([]); // Clear the file array after upload
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files.");
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (!recipeName.trim() || !ingredients.trim() || !procedure.trim()) {
      alert("Please fill out all required fields.");
      return;
    }
  
    setUploading(true);
  
    try {
      // Ensure photos are uploaded first
      const urls = await Promise.all(photos.map((file) => uploadToCloudinary(file)));
      setUploadedUrls(urls); // Update state with uploaded URLs
  
      // Form data
      const data = {
        photos: urls, // Use the URLs directly from the upload result
        recipeName,
        ingredients,
        procedure,
        calorieCount,
        nutritionValues,
        tags,
        category: selectedCategory,
      };
  
      // Generate a unique document ID
      const documentId = recipeName.toLowerCase().replace(/\s+/g, "_");
  
      // Upload the data to Firestore
      await uploadSingleDocument("recipes", documentId, data);
  
      // Hide the upload page and reset form state
      setShowUploadPage(false);
      alert("Recipe uploaded successfully!");
    } catch (error) {
      console.error("Error during form submission:", error);
      alert("Error uploading recipe. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="upload-page">
      <h2>Category: {selectedCategory}</h2>

      <form onSubmit={handleFormSubmit} className="upload-form">
        {/* Photo Upload Section */}
        <div className="form-section">
          <label>Photo</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={photos.length >= 5}
          />
          <p>{photos.length < 5 ? 'or drag and drop up to 5 photos' : 'Photo limit reached'}</p>
        </div>

        {/* Recipe Name */}
        <div className="form-section">
          <label>Recipe Name</label>
          <input
            type="text"
            placeholder="What do you call your recipe?"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
          />
        </div>

        {/* Ingredients */}
        <div className="form-section">
          <label>Ingredients</label>
          <textarea
            placeholder="List your ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>

        {/* Procedure */}
        <div className="form-section">
          <label>Procedure</label>
          <textarea
            placeholder="How do you cook your recipe?"
            value={procedure}
            onChange={(e) => setProcedure(e.target.value)}
          />
        </div>

        {/* Calorie Count */}
        <div className="form-section">
          <label>Calorie Count</label>
          <input
            type="number"
            placeholder="What's your calorie count?"
            value={calorieCount}
            onChange={(e) => setCalorieCount(e.target.value)}
          />
        </div>

        {/* Nutrition Values */}
        <div className="form-section">
          <label>Nutrition Values</label>
          <textarea
            placeholder="List your nutrition values"
            value={nutritionValues}
            onChange={(e) => setNutritionValues(e.target.value)}
          />
        </div>

        {/* Recipe Tags */}
        <div className="form-section tags-section">
          <label>Recipe Tags</label>
          <input id="tagInput" type="text" placeholder="Add a tag" />
          <button type="button" onClick={handleTagAdd}>+</button>
          <div className="tags-container">
            {tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={uploading}>
          {uploading ? "Uploading..." : "Post Recipe"}
        </button>
      </form>
    </div>
  );
}

export default UploadPage;
