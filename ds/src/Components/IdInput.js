import React from 'react';

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
