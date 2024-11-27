// src/App.js
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Auth from './components/Auth.jsx';
import Home from './components/MainScreen.jsx';
import SignupDetail from './components/SignupDetail.jsx';

// Define routes for your app
const router = createBrowserRouter([
  {
    path: '/',
    element: <Auth />,  // Route for login page
  },
  {
    path: '/home',
    element: <Home />,  // Route for home page
  },
  {
    path: '/Signupdetails', 
    element: <SignupDetail />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
