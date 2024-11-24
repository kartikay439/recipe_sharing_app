import "../css/DataSection.css";
import React, { useState } from "react";
import AllRecipe from "./AllRecipe.jsx";

export default function DataSection({ homeSearch ,user}) {
  console.log("datasection ",user)
  return (
    <div className="datasection">
      <AllRecipe homeSearch={homeSearch} user={user}/>
    </div>
  );
}
