import { useState } from 'react'
import SignUp from './SignUp.jsx'
import SignIn from './SignIn.jsx'

import Honey from '../assets/honey.jpeg'
import '../css/auth.css'
function SignUpForm() {
  const [authType, setAuthType] = useState(false);
  const handleChange = () => {
    setAuthType(!authType)
  }

  return (
    <>
      <h1 className='title-auth'>RECIPE</h1>
      <div className="main">
        <div className="right">
          <img className='hn' src={Honey} alt="" />
        </div>

        <div className="auth">
          {
            authType ?
              (
                <div className="signUp">
                  <SignIn />
                </div>

              ) :
              (
                <div className="signUn">
                  <SignUp />
                </div>
              )


          }
          <a className="sc" href="#" onClick={handleChange}>{authType ? "signUp" : "signIn"}</a>

        </div>
      </div>

    </>
  );
}

export default SignUpForm;
