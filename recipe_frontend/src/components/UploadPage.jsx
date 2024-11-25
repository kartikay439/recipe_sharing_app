import React, { useState } from "react";
import "../css/uploadPage.css";
import {doc, setDoc } from "firebase/firestore";
import cloudinaryConfig from "../utils/cloudinaryConfig";
import { auth, db } from "../utils/firebase";
import Su from "../assets/image.png";
import backArrow from "../assets/backspace.png";

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

async function uploadToCloudinary(file) {
    const { CLOUDINARY_URL, UPLOAD_PRESET } = cloudinaryConfig;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
        const response = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Failed to upload file: ${response.statusText}`);
        }

        const data = await response.json();
        return data.secure_url; // Return the uploaded file's URL
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        throw error;
    }
}

function UploadPage({ selectedCategory, setShowUploadPage, setShowCategory }) {
    const [photos, setPhotos] = useState([]); // Array of files to upload
    const [recipeName, setRecipeName] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [procedure, setProcedure] = useState("");
    const [calorieCount, setCalorieCount] = useState("");
    const [nutritionValues, setNutritionValues] = useState("");
    const [tags, setTags] = useState([]);
    const [uploadedUrls, setUploadedUrls] = useState([]); // Array of uploaded file URLs
    const [uploading, setUploading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); // New state for success message

    const handlePhotoUpload = (event) => {
        const files = Array.from(event.target.files);
        setPhotos((prevPhotos) => [
            ...prevPhotos,
            ...files.slice(0, 5 - prevPhotos.length),
        ]);
    };

    const handleTagAdd = () => {
        const newTag = document.getElementById("tagInput").value.trim();
        if (newTag && !tags.includes(newTag)) {
            setTags((prevTags) => [...prevTags, newTag]);
            document.getElementById("tagInput").value = ""; // Clear the input
        }
    };

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

    // Function to remove a specific photo by index
    const handleRemovePhoto = (index) => {
        setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!recipeName.trim() || !ingredients.trim() || !procedure.trim()) {
            alert("Please fill out all required fields.");
            return;
        }

        setUploading(true);

        try {
            const urls = await Promise.all(photos.map((file) => uploadToCloudinary(file)));
            setUploadedUrls(urls); // Update state with uploaded URLs

            const data = {
                userId: auth.currentUser.uid,
                photos: urls,
                recipeName,
                ingredients,
                procedure,
                calorieCount,
                nutritionValues,
                tags,
                category: selectedCategory,
            };

            const documentId = recipeName.toLowerCase().replace(/\s+/g, "_");

            await uploadSingleDocument("recipes", documentId, data);

            // Show the success message
            setShowSuccessMessage(true);

            // Hide the success message after 3 seconds and close the upload page
            setTimeout(() => {
                setShowSuccessMessage(false);
                setShowUploadPage(false);
            }, 2000);
        } catch (error) {
            console.error("Error during form submission:", error);
            alert("Error uploading recipe. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-page">
            {showSuccessMessage ? (
                <div >
                    <img id="success-message" src={Su} alt="Success" />
                </div>
            ) : (
                <>
                    <h2>Category: {selectedCategory}</h2>

                    <form onSubmit={handleFormSubmit} className="upload-form">
                        <button
                            className="back-button"
                            onClick={() => {
                                setShowUploadPage(false);
                                setShowCategory(true);
                            }}
                        >
                            <img src={backArrow} alt="Back" className="back-arrow-icon" />
                        </button>
                        {/* Photo Upload Section */}
                        <div className="form-section">
                            <label>Photo</label>
                            {/* Button to trigger the file input dialog */}
                            <button
                                type="button"
                                onClick={() => document.getElementById("photoInput").click()}
                                disabled={photos.length >= 5}
                                className="upload-button"
                            >
                                {photos.length < 5 ? "Upload Photos" : "Photo Limit Reached"}
                            </button>

                            {/* Hidden file input */}
                            <input
                                id="photoInput"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                style={{ display: "none" }} // Hide the file input
                                disabled={photos.length >= 5}
                            />

                            {/* Image Previews */}
                            <div className="preview-container">
                                {photos.map((photo, index) => (
                                    <div key={index} className="preview-item">
                                        <img
                                            src={URL.createObjectURL(photo)} // Generate a temporary preview URL
                                            alt={`Preview ${index + 1}`}
                                            className="preview-image"
                                        />
                                        <button
                                            type="button"
                                            className="remove-button"
                                            onClick={() => handleRemovePhoto(index)}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
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
                            <button type="button" onClick={handleTagAdd}>
                                +
                            </button>
                            <div className="tags-container">
                                {tags.map((tag, index) => (
                                    <span key={index} className="tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="submit-button" disabled={uploading}>
                            {uploading ? "Uploading..." : "Post Recipe"}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}

export default UploadPage;
