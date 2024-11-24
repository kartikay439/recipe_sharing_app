import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import HomeSearch from "./HomeSearchBlock.jsx";
import About from "./about.jsx";
import Category from "./category.jsx";
import DataSection from "./DataSection.jsx";
import UploadPage from "./UploadPage.jsx";
import { auth } from "../utils/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import "../home.css";

function MainScreen() {
  const [user, setUser] = useState("no usr");
  const [showCategory, setShowCategory] = useState(false);
  const [showUploadPage, setShowUploadPage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [homeSearch, setHomeSearch] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
    });
  }, []);

  const handleCategoryClick = () => {
    setShowCategory(!showCategory);
    setShowUploadPage(false);
  };

  const categoryHandled = (category) => {
    setSelectedCategory(category);
    setShowCategory(false);
    setShowUploadPage(true);
  };

  const heandleUserClick=()=>{
    setHomeSearch(!homeSearch)
  }
  return (
    <div className="main-screen home">
      <NavBar onPlusClick={handleCategoryClick} />

      <div className="content">
        {showCategory ? (
          <Category clickHandle={categoryHandled} />
        ) : showUploadPage ? (
          <UploadPage selectedCategory={selectedCategory} setShowUploadPage={setShowUploadPage} />
        ) : (
          <>
            {user ? (
              <>
                {homeSearch ? <HomeSearch /> : <></>}
                <DataSection homeSearch={setHomeSearch} user={user.uid}/>
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
