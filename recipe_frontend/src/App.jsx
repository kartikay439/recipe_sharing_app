// src/App.js
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Auth from './components/Auth.jsx';
import Home from './components/MainScreen.jsx';
import Category from './components/category.jsx';
import SignupDetail from './components/SignupDetail.jsx';
import UploadPage from './components/UploadPage.jsx'; // Import UploadPage Component

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
    path: '/categories',
    element: <Category />,  // Route for category page
  },
  {
    path: '/upload/:category', // Route for upload page with category parameter
    element: <UploadPage />,
  },
  {
    path: '/Signupdetails', // Route for upload page with category parameter
    element: <SignupDetail />,
  },
]);

function App() {
  return (
    <>
      {/* Use RouterProvider to provide the router to the application */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
