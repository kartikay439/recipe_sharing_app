import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import HomeSearchBlock from "./HomeSearchBlock.jsx";
import AllRecipe from "./AllRecipe.jsx";
import About from "./about.jsx";
import Category from "./category.jsx";
import DataSection from "./DataSection.jsx";
import UploadPage from "./UploadPage.jsx";
import Profile from "./profilePage.jsx";
import { auth } from "../utils/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import "../../homeCSS/home.css";

function MainScreen() {
  const [user, setUser] = useState(null);
  const [showCategory, setShowCategory] = useState(false);
  const [showUploadPage, setShowUploadPage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [homeSearch, setHomeSearch] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user || null);
    });
  }, []);

  const handleCategoryClick = () => {
    setShowCategory(!showCategory);
    setShowUploadPage(false);
    setShowProfile(false);
    setHomeSearch(true);
    setSearchTerm(false);
  };

  const categoryHandled = (category) => {
    setSelectedCategory(category);
    setShowCategory(false);
    setShowProfile(false);
    setShowUploadPage(true);
    setSearchTerm(false);
  };

  const handleUserClick = () => {
    setShowProfile(!showProfile);
    setHomeSearch(false);
    setShowCategory(false);
    setShowUploadPage(false);
    setSearchTerm(false);
  };

  const handleLogoClick = () => {
    setHomeSearch(true);
    setShowProfile(false);
    setShowCategory(false);
    setShowUploadPage(false);
    setIsDetailVisible(false);
    setSearchTerm(false);
  };

  return (
    <div className="main-screen home">
      <NavBar
        onPlusClick={handleCategoryClick}
        onUserClick={handleUserClick}
        onLogoClick={handleLogoClick}
      />

      <div className="content">
        {showCategory ? (
          <Category 
            clickHandle={categoryHandled}
            setShowCategory={setShowCategory} 
          />
        ) : showUploadPage ? (
          <UploadPage
            selectedCategory={selectedCategory}
            setShowUploadPage={setShowUploadPage}
            setShowCategory={setShowCategory}
          />
        ) : showProfile ? (
          <Profile 
            userId={user?.uid} 
            onLogoClick={handleLogoClick}
          />
        ) : (
          <>
            {user ? (
              <>
                {!isDetailVisible && homeSearch && (
                  <HomeSearchBlock setSearchTerm={setSearchTerm} />
                )}
                <AllRecipe
                  searchQuery={searchTerm}
                  homeSearch={setHomeSearch}
                  user={user.uid}
                  setDetailVisible={setIsDetailVisible}
                  setSearchTerm={setSearchTerm}
                />
                {!homeSearch && !isDetailVisible && (
                  <DataSection homeSearch={setHomeSearch} user={user.uid} />
                )}
              </>
            ) : (
              <h1>You are not signed in</h1>
            )}
          </>
        )}
      </div>

      <About />
    </div>
  );
}

export default MainScreen;
