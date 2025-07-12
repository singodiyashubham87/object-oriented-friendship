import { Cancel01FreeIcons, StarIcon } from "@hugeicons/core-free-icons";
import { Tick02FreeIcons } from "@hugeicons/core-free-icons/index";
import { HugeiconsIcon } from "@hugeicons/react";

const FeedCardActions = ({ onReject, onBookmark, onAccept }) => {
  const renderAction = (icon, colorClass, handler) => {
    if (!handler) {
      return (
        <div
          className={`p-2 ${colorClass} rounded-full border-xs border-primary-dark`}
        >
          <HugeiconsIcon icon={icon} size={26} />
        </div>
      );
    }
    return (
      <button
        type="button"
        onClick={handler}
        className={`p-2 ${colorClass} hover:opacity-90 rounded-full border-xs border-primary-dark cursor-pointer`}
      >
        <HugeiconsIcon icon={icon} size={26} />
      </button>
    );
  };

  return (
    <div className="buttons flex gap-8 mt-4 justify-center">
      {renderAction(Cancel01FreeIcons, "bg-primary-pink", onReject)}
      {renderAction(StarIcon, "bg-primary-cyan", onBookmark)}
      {renderAction(Tick02FreeIcons, "bg-primary-green", onAccept)}
    </div>
  );
};

export default FeedCardActions;
