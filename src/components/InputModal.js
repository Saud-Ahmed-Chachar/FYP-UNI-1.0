
import React, { useState } from 'react';
const InputModal = ({ isOpen, onClose, onSubmit, title, children }) => {
    const [inputValue, setInputValue] = useState("");
  
    const handleOnSubmit = (e) => {
      e.preventDefault();
      onSubmit(inputValue);
      onClose(); // Close the modal after submitting
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-4 rounded w-full max-w-md">
          <h3 className="text-lg font-semibold">{title}</h3>
          <form onSubmit={handleOnSubmit}>
            {children}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-2"
              required
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded">
                Cancel
              </button>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default InputModal;
  