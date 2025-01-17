import React from 'react';
import '../css/category.css';
import backArrow from "../assets/backspace.png";

function Category({ clickHandle,setShowCategory }) {
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert'];

  return (
    <div className="category">
      <button
        className="back-button"
        onClick={() => {
          setShowCategory(false);
        }}
      >
        <img src={backArrow} alt="Back" className="back-arrow-icon" />
      </button>
      <h1>Select a Category</h1>
      <ul className="category-list">
        {categories.map((category, index) => (
          <li
            key={index}
            onClick={() => clickHandle(category)}
            style={{ cursor: 'pointer' }}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Category;
