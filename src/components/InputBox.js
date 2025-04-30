import React from "react";
import "./InputBox.css";

const InputBox = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="input-box">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for Book Name here..."
      />
    </div>
  );
};

export default InputBox;
