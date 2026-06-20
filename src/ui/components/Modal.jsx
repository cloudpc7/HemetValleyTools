import { useEffect } from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeOnBackdropClick = true,
  size = 'md',
  className = ''
}) => {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeOnBackdropClick ? onClose : undefined}
      />

      {/* Modal Content */}
      <div 
        className={`relative bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} ${className}`}
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          {title && (
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          )}
          
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none transition-colors"
            >
              ×
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-6 overflow-auto max-h-[80vh]">
          {children}
        </div>

        {/* Optional Footer - You can pass buttons as children or add footer prop later */}
      </div>
    </div>
  );
};

export default Modal;