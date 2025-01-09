import React from 'react';
import "../Styles/Clebine.css";

const IdInput = ({ filterId, onIdChange }) => {
  return (
    <input
      type="text"
      value={filterId}
      onChange={onIdChange}
      placeholder="ID 입력"
      className="id-input"
    />
  );
};

export default IdInput;
