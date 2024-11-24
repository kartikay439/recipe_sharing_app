import React from "react";
import "../css/HomeScreenSearchBlock.css";

const HomeSearchBlock = ({ setSearchTerm }) => {
  return (
    <div className="homes">
      <input
        className="search"
        type="text"
        placeholder="Search for recipe 😋"
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term in parent
      />
    </div>
  );
};

export default HomeSearchBlock;
