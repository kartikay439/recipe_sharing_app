import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../utils/firebase';
import { setDoc, doc } from 'firebase/firestore';
import cloudinaryConfig from '../utils/cloudinaryConfig'; // Import Cloudinary config
import About from "./about.jsx";
import '../css/SignupDetail.css';

const SignupDetail = () => {
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        gender: '',
        dob: '',
        email: auth.currentUser?.email || '',
        phone: '',
        about: '',
        instagram: '',
        facebook: '',
        pinterest: '',
    });

    const { CLOUDINARY_URL, UPLOAD_PRESET } = cloudinaryConfig;
    // Handle image selection
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfileImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                document.getElementById('hidden').textContent = "Change Image";
            }
            reader.readAsDataURL(file);
        }
    };

    // Handle input field changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            let profileImageUrl = null;

            // Upload image to Cloudinary if selected
            if (profileImageFile) {
                const formData = new FormData();
                formData.append('file', profileImageFile);
                formData.append('upload_preset', UPLOAD_PRESET);

                const response = await fetch(CLOUDINARY_URL, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                profileImageUrl = data.secure_url; // Fetch the image URL from Cloudinary response
            }

            // Save user details to Firestore
            await setDoc(doc(db, 'user', auth.currentUser.uid), {
                ...formData,
                profileImage: profileImageUrl,
                userId: auth.currentUser.uid, // Include user ID
                
            });

            console.log('User details saved successfully.');
            navigate('/home');
        } catch (error) {
            console.error('Error saving user details:', error);
        }
    };

    return (
        <main id="SignupDetail-content">
            <nav>
                <svg width="80" height="40" viewBox="0 -20 119 84" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M84 49.4286L109 44M84 49.4286H9L10.0975 54.5884C10.5895 56.9042 12.6327 59.0409 15.8384 60.5919C19.0441 62.143 23.1884 63 27.4825 63H65.5175C69.8116 63 73.9559 62.143 77.1616 60.5919C80.3672 59.0409 82.4105 56.9042 82.9025 54.5884L84 49.4286Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23.249 14.5586L27.0869 15.7012C26.8623 17.791 26.208 19.4219 25.124 20.5938C24.04 21.7559 22.707 22.3369 21.125 22.3369C19.0742 22.3369 17.4092 21.3652 16.1299 19.4219C14.8604 17.4785 14.2256 14.7295 14.2256 11.1748C14.2256 7.88379 14.7822 5.30078 15.8955 3.42578C17.0088 1.55078 18.3906 0.613281 20.041 0.613281C21.1836 0.613281 22.1846 1.2041 23.0439 2.38574H23.1025V0.935547H26.457V8.05469H23.1025C22.9268 5.44727 22.2969 4.14355 21.2129 4.14355C20.4902 4.14355 20.0605 4.66602 19.9238 5.71094C19.7871 6.75586 19.7188 8.56738 19.7188 11.1455C19.7188 14.29 19.8213 16.3506 20.0264 17.3271C20.2412 18.3037 20.7148 18.792 21.4473 18.792C22.0234 18.792 22.4434 18.4502 22.707 17.7666C22.9805 17.0732 23.1611 16.0039 23.249 14.5586ZM36.125 22.3369C33.957 22.3369 32.2139 21.3555 30.8955 19.3926C29.5869 17.4199 28.9326 14.7783 28.9326 11.4678C28.9326 8.16699 29.582 5.53516 30.8809 3.57227C32.1895 1.59961 33.9375 0.613281 36.125 0.613281C38.3027 0.613281 40.0459 1.59473 41.3545 3.55762C42.6729 5.52051 43.332 8.15723 43.332 11.4678C43.332 14.7783 42.6729 17.4199 41.3545 19.3926C40.0459 21.3555 38.3027 22.3369 36.125 22.3369ZM36.125 18.792C36.6035 18.792 36.96 18.6113 37.1943 18.25C37.4287 17.8789 37.5947 17.1855 37.6924 16.1699C37.79 15.1445 37.8389 13.5771 37.8389 11.4678C37.8389 9.3584 37.79 7.7959 37.6924 6.78027C37.5947 5.75488 37.4287 5.06152 37.1943 4.7002C36.96 4.3291 36.6035 4.14355 36.125 4.14355C35.6562 4.14355 35.2998 4.3291 35.0557 4.7002C34.8213 5.06152 34.6553 5.75488 34.5576 6.78027C34.4697 7.7959 34.4258 9.3584 34.4258 11.4678C34.4258 13.5771 34.4697 15.1445 34.5576 16.1699C34.6553 17.1855 34.8213 17.8789 35.0557 18.25C35.2998 18.6113 35.6562 18.792 36.125 18.792ZM52.6777 22.3369C50.5098 22.3369 48.7666 21.3555 47.4482 19.3926C46.1396 17.4199 45.4854 14.7783 45.4854 11.4678C45.4854 8.16699 46.1348 5.53516 47.4336 3.57227C48.7422 1.59961 50.4902 0.613281 52.6777 0.613281C54.8555 0.613281 56.5986 1.59473 57.9072 3.55762C59.2256 5.52051 59.8848 8.15723 59.8848 11.4678C59.8848 14.7783 59.2256 17.4199 57.9072 19.3926C56.5986 21.3555 54.8555 22.3369 52.6777 22.3369ZM52.6777 18.792C53.1562 18.792 53.5127 18.6113 53.7471 18.25C53.9814 17.8789 54.1475 17.1855 54.2451 16.1699C54.3428 15.1445 54.3916 13.5771 54.3916 11.4678C54.3916 9.3584 54.3428 7.7959 54.2451 6.78027C54.1475 5.75488 53.9814 5.06152 53.7471 4.7002C53.5127 4.3291 53.1562 4.14355 52.6777 4.14355C52.209 4.14355 51.8525 4.3291 51.6084 4.7002C51.374 5.06152 51.208 5.75488 51.1104 6.78027C51.0225 7.7959 50.9785 9.3584 50.9785 11.4678C50.9785 13.5771 51.0225 15.1445 51.1104 16.1699C51.208 17.1855 51.374 17.8789 51.6084 18.25C51.8525 18.6113 52.209 18.792 52.6777 18.792ZM61.6426 22V18.8506H63.1807V4.08496H61.6426V0.935547H69.4795V4.08496H68.1904V18.8506H69.2012V22H61.6426ZM70.6807 22V18.8506H71.7207L68.6885 10.9551L72.2627 4.08496H70.9443V0.935547H77.0967V4.08496H75.8369L73.0098 9.46094L76.6719 18.8506H77.9609V22H70.6807ZM13.0537 44V40.8506H14.5625V26.085H13.0537V22.9355H20.3486C22.458 22.9355 24.1133 23.4092 25.3145 24.3564C26.5254 25.2939 27.1309 26.6611 27.1309 28.458C27.1309 30.6846 26.1592 32.1445 24.2158 32.8379C26.4131 33.8047 27.5117 35.4648 27.5117 37.8184C27.5117 39.7617 26.8525 41.2803 25.5342 42.374C24.2256 43.458 22.3848 44 20.0117 44H13.0537ZM19.5723 25.9385V31.7832C20.6758 31.7832 21.374 31.5635 21.667 31.124C21.9697 30.6748 22.1211 29.957 22.1211 28.9707C22.1211 28.1113 22.0283 27.4619 21.8428 27.0225C21.6572 26.583 21.3936 26.2949 21.0518 26.1582C20.71 26.0117 20.2168 25.9385 19.5723 25.9385ZM19.5723 34.6689V40.8506C20.2754 40.8506 20.8125 40.792 21.1836 40.6748C21.5547 40.5479 21.8379 40.2695 22.0332 39.8398C22.2285 39.4004 22.3262 38.7168 22.3262 37.7891C22.3262 36.8711 22.2188 36.1875 22.0039 35.7383C21.7988 35.2891 21.5156 35.001 21.1543 34.874C20.793 34.7373 20.2656 34.6689 19.5723 34.6689ZM36.9014 44.3369C34.7334 44.3369 32.9902 43.3555 31.6719 41.3926C30.3633 39.4199 29.709 36.7783 29.709 33.4678C29.709 30.167 30.3584 27.5352 31.6572 25.5723C32.9658 23.5996 34.7139 22.6133 36.9014 22.6133C39.0791 22.6133 40.8223 23.5947 42.1309 25.5576C43.4492 27.5205 44.1084 30.1572 44.1084 33.4678C44.1084 36.7783 43.4492 39.4199 42.1309 41.3926C40.8223 43.3555 39.0791 44.3369 36.9014 44.3369ZM36.9014 40.792C37.3799 40.792 37.7363 40.6113 37.9707 40.25C38.2051 39.8789 38.3711 39.1855 38.4688 38.1699C38.5664 37.1445 38.6152 35.5771 38.6152 33.4678C38.6152 31.3584 38.5664 29.7959 38.4688 28.7803C38.3711 27.7549 38.2051 27.0615 37.9707 26.7002C37.7363 26.3291 37.3799 26.1436 36.9014 26.1436C36.4326 26.1436 36.0762 26.3291 35.832 26.7002C35.5977 27.0615 35.4316 27.7549 35.334 28.7803C35.2461 29.7959 35.2021 31.3584 35.2021 33.4678C35.2021 35.5771 35.2461 37.1445 35.334 38.1699C35.4316 39.1855 35.5977 39.8789 35.832 40.25C36.0762 40.6113 36.4326 40.792 36.9014 40.792ZM53.4541 44.3369C51.2861 44.3369 49.543 43.3555 48.2246 41.3926C46.916 39.4199 46.2617 36.7783 46.2617 33.4678C46.2617 30.167 46.9111 27.5352 48.21 25.5723C49.5186 23.5996 51.2666 22.6133 53.4541 22.6133C55.6318 22.6133 57.375 23.5947 58.6836 25.5576C60.002 27.5205 60.6611 30.1572 60.6611 33.4678C60.6611 36.7783 60.002 39.4199 58.6836 41.3926C57.375 43.3555 55.6318 44.3369 53.4541 44.3369ZM53.4541 40.792C53.9326 40.792 54.2891 40.6113 54.5234 40.25C54.7578 39.8789 54.9238 39.1855 55.0215 38.1699C55.1191 37.1445 55.168 35.5771 55.168 33.4678C55.168 31.3584 55.1191 29.7959 55.0215 28.7803C54.9238 27.7549 54.7578 27.0615 54.5234 26.7002C54.2891 26.3291 53.9326 26.1436 53.4541 26.1436C52.9854 26.1436 52.6289 26.3291 52.3848 26.7002C52.1504 27.0615 51.9844 27.7549 51.8867 28.7803C51.7988 29.7959 51.7549 31.3584 51.7549 33.4678C51.7549 35.5771 51.7988 37.1445 51.8867 38.1699C51.9844 39.1855 52.1504 39.8789 52.3848 40.25C52.6289 40.6113 52.9854 40.792 53.4541 40.792ZM62.4189 44V40.8506H63.957V26.085H62.4189V22.9355H70.2559V26.085H68.9668V40.8506H69.9775V44H62.4189ZM71.457 44V40.8506H72.4971L69.4648 32.9551L73.0391 26.085H71.7207V22.9355H77.873V26.085H76.6133L73.7861 31.4609L77.4482 40.8506H78.7373V44H71.457Z" fill="white"/>
                </svg>
                <div className="nav-container">
                    <h3>Welcome to Family</h3>
                </div>
                <div></div>
            </nav>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h2>Signup Details</h2>

                    {/* Image Upload Section */}
                    <div className="image-upload">
                        <label htmlFor="profileImage" className="image-upload-label">
                            <span> <h6 id="hidden">Upload Profile Image</h6>
                            <input
                                id="profileImage"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            </span>
                        </label>
                        {profileImage && (
                            <div className="image-preview">
                                <img src={profileImage} alt="Profile Preview" />
                            </div>
                        )}
                    </div>

                    <fieldset>
                        <legend>Personal Information</legend>
                        <label htmlFor="firstname">First Name:</label>
                        <input
                            id="firstname"
                            type="text"
                            name="firstname"
                            placeholder='Enter First Name'
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                        />
                        <br />
                        <label htmlFor="lastname">Last Name:</label>
                        <input
                            id="lastname"
                            type="text"
                            name="lastname"
                            placeholder='Enter Last Name'
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                        />
                        <br />
                        <label>Gender:</label>
                        <div className="radio-group">
                        <select
                            id="gender"
                            name="gender"
                            style={{ width: "20%", marginLeft: "2%"}}
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="Other">Other</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        </div>
                        <br />
                        <label htmlFor="dob">Date of Birth:</label>
                        <input
                            id="dob"
                            type="date"
                            name="dob"
                            style={{ width: "15%"}}
                            value={formData.dob}
                            onChange={handleChange}
                            required
                        />
                        <br />
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder='exa@gmail.com'
                            value={formData.email}
                            onChange={handleChange}
                            readOnly
                        />
                        <br />
                        <label htmlFor="phone">Phone:</label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            pattern="[0-9]{10}"
                            placeholder="1234567890"
                            required
                        />
                        <br />
                        <label htmlFor="about">About Me:</label>
                        <br />
                        <textarea
                            id="about"
                            name="about"
                            value={formData.about}
                            onChange={handleChange}
                            placeholder="Enter your details here..."
                            maxLength="100"
                            style={{ height: "100px", width: "90%", margin:"0 2%" }}
                        />
                    </fieldset>

                    <fieldset>
                        <legend>Social Media Links</legend>
                        <label htmlFor="instagram">Instagram:</label>
                        <input
                            id="instagram"
                            type="url"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleChange}
                            placeholder="https://www.instagram.com/username"
                        />
                        <br />
                        <label htmlFor="facebook">Facebook:</label>
                        <input
                            id="facebook"
                            type="url"
                            name="facebook"
                            value={formData.facebook}
                            onChange={handleChange}
                            placeholder="https://facebook.com/username"
                        />
                        <br />
                        <label htmlFor="pinterest">Pinterest:</label>
                        <input
                            id="pinterest"
                            type="url"
                            name="pinterest"
                            value={formData.pinterestb}
                            onChange={handleChange}
                            placeholder="https://pinterest.com/username"
                        />
                    </fieldset>

                    <button type="submit">Submit</button>
                </form>
            </div>

            <About />
        </main>
    );
};

export default SignupDetail;
