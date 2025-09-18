import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-slate-800 border border-cyan-500/50 rounded-xl shadow-lg shadow-cyan-500/20 max-w-lg w-full p-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-orbitron text-cyan-300">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-3xl leading-none font-bold" aria-label="Close modal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
