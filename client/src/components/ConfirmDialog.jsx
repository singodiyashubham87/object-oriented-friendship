const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className="bg-secondary-dark border-2 border-primary-silver max-w-sm w-full rounded-custom-s shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <h3
          id="dialog-title"
          className="text-xl font-bold text-primary-silver mb-2 uppercase tracking-wide"
        >
          {title}
        </h3>
        <p className="text-secondary-silver mb-6 text-sm md:text-base">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row justify-end gap-3 w-full mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border-2 border-secondary-silver text-secondary-silver hover:bg-secondary-silver hover:text-primary-dark font-semibold uppercase text-sm rounded-custom-xs transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 border-2 font-semibold uppercase text-sm rounded-custom-xs transition-colors ${
              isDestructive
                ? "border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                : "border-primary-silver text-primary-silver hover:bg-primary-silver hover:text-secondary-dark"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
