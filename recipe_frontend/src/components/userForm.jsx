import React, { useState } from "react";
// import "../css/userForm.css"; // Separate CSS files
import uploadToCloudinary from "../utils/uploadToCloudinary";
import app from "../utils/firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Initialize Firestore instance
const db = getFirestore(app);

export const uploadSingleDocument = async (collectionName, documentId, data) => {
  try {
    const docRef = doc(db, collectionName, documentId); // Set the document ID
    await setDoc(docRef, data); // Upload the document
    console.log("Document uploaded successfully:", documentId);
  } catch (error) {
    console.error("Error uploading document:", error);
  }
};

const Form = ({ user,formComponent }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "Male",
    dob: "",
    phone: "",
    github: "",
    linkedin: "",
    photo: null, // Store photo file
  });
  const [profileUrl, setProfileUrl] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo" && files?.[0]) {
      setFormData({ ...formData, photo: files[0] }); // Temporarily store the photo file
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhotoUpload = async () => {
    if (!formData.photo) return ""; // No photo to upload

    try {
      const url = await uploadToCloudinary(formData.photo);
      console.log("Uploaded photo URL:", url);
      return url;
    } catch (error) {
      console.error("Error uploading photo:", error);
      throw new Error("Photo upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload photo (if any)
      const uploadedPhotoUrl = await handlePhotoUpload();
      setProfileUrl(uploadedPhotoUrl);

      // Prepare document data
      const documentId = `${formData.firstName.toLowerCase()}_${Date.now()}`;
      const data = {
        ...formData,
        profileUrl: uploadedPhotoUrl,
        userId: user.uid, // Include user ID
      };
      delete data.photo; // Remove raw photo file from submission

      // Upload document to Firestore
      await uploadSingleDocument("user", documentId, data);
      console.log("Form submitted successfully:", data);

      // alert("Form submitted successfully!");
      formComponent(false);
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        gender: "Male",
        dob: "",
        phone: "",
        github: "",
        linkedin: "",
        photo: null,
      });
      setProfileUrl("");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>User Registration Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Input fields */}
        {[
          { label: "First Name", id: "firstName", type: "text", required: true },
          { label: "Last Name", id: "lastName", type: "text", required: true },
          { label: "Email", id: "email", type: "email", required: true },
          { label: "Date of Birth", id: "dob", type: "date", required: true },
          { label: "Phone", id: "phone", type: "tel", required: true },
          { label: "GitHub Profile", id: "github", type: "url", required: false },
          { label: "LinkedIn Profile", id: "linkedin", type: "url", required: false },
        ].map(({ label, id, type, required }) => (
          <div key={id} className="user-form-group">
            <label htmlFor={id}>{label}</label>
            <input
              className="formin"
              type={type}
              id={id}
              name={id}
              value={formData[id]}
              onChange={handleChange}
              required={required}
            />
          </div>
        ))}

        {/* Gender Dropdown */}
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Photo Upload */}
        <div className="form-group">
          <label htmlFor="photo">Profile Photo</label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Form;
