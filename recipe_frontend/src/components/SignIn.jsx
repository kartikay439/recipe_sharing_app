import React, { useState } from 'react';
import { auth } from "../utils/firebase.js";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../css/signup.css'

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created:', user.uid);
      navigate('/home'); // Redirect after successful sign-up
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Error signing up:', error);
    }
  };

  return (
  
      <div className="sign-form-container">
        <h2>SIGN IN</h2>
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
          <button type="submit" className="signup-button">SIGN IN</button>
        </form>
    </div>
    
  );
}

export default SignInForm;
