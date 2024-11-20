const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file); // The actual file
    formData.append("upload_preset", "your-upload-preset"); // Replace with your unsigned preset
  
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/your-cloud-name/image/upload`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Cloudinary upload failed: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Uploaded file URL:", data.secure_url);
      return data.secure_url; // The URL of the uploaded file
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };
  
  // Usage example:
  const handleFileInput = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const uploadedUrl = await uploadToCloudinary(file);
      console.log("Uploaded File URL:", uploadedUrl);
    }
  };
  