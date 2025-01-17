import React, { useState } from 'react';
import { auth } from "../utils/firebase.js";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../css/signup.css'

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created:', user.uid);
      navigate('/Signupdetails'); // Redirect after successful sign-up
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Error signing up:', error);
    }
  };

  return (
  
      <div className="form-container">
        <h2>SIGN UP</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>} 
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='Email'
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Password'
            />
          </div>
          <button type="submit" className="signup-button">SIGN UP</button>
        </form>
    </div>
    
  );
}

export default SignUpForm;
