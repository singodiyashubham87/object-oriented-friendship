import { useNavigate } from "react-router-dom";

const RequestDialog = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Invisible backdrop - click to close */}
      <div
        className="fixed inset-0 z-100"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Close menu"
      />

      {/* Popover */}
      <div className="absolute top-full right-0 mt-2 z-100 w-48">
        <div className="bg-primary-dark border border-secondary-silver rounded-custom-xs shadow-lg overflow-hidden">
          <button
            type="button"
            onClick={() => handleNavigation("/received-requests")}
            className="w-full py-2.5 px-4 text-left text-primary-silver hover:bg-secondary-silver hover:text-primary-dark font-primary font-semibold uppercase text-sm transition-all duration-200"
          >
            Received
          </button>

          <div className="border-t border-secondary-silver/30" />

          <button
            type="button"
            onClick={() => handleNavigation("/sent-requests")}
            className="w-full py-2.5 px-4 text-left text-primary-silver hover:bg-secondary-silver hover:text-primary-dark font-primary font-semibold uppercase text-sm transition-all duration-200"
          >
            Sent
          </button>
        </div>
      </div>
    </>
  );
};

export default RequestDialog;
