const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-4 rounded w-full max-w-lg">
          <div className="modal-content max-h-[80vh] overflow-auto">
            {children}
          </div>
          <button onClick={onClose} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
            Close
          </button>
        </div>
      </div>
    );
  };
  
  export default Modal;
  