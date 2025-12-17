import { Cancel01FreeIcons, StarIcon } from "@hugeicons/core-free-icons";
import {
  Cancel02FreeIcons,
  Tick03FreeIcons,
} from "@hugeicons/core-free-icons/index";
import { HugeiconsIcon } from "@hugeicons/react";

const FeedCardActions = ({ onReject, onBookmark, onAccept, isBookmarked }) => {
  const renderAction = (icon, colorClass, handler, fill = "", title = "") => {
    const iconClasses = "w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6";
    if (!handler) {
      return (
        <div
          className={`p-1 sm:p-1.5 md:p-2 ${colorClass} rounded-full border-xs border-primary-dark`}
          title={title}
        >
          <HugeiconsIcon icon={icon} className={iconClasses} fill={fill} />
        </div>
      );
    }
    return (
      <button
        type="button"
        onClick={handler}
        className={`p-1 sm:p-1.5 md:p-2 ${colorClass} hover:opacity-90 rounded-full border-xs border-primary-dark cursor-pointer`}
        title={title}
      >
        <HugeiconsIcon icon={icon} className={iconClasses} fill={fill} />
      </button>
    );
  };

  return (
    <div className="buttons flex gap-3 sm:gap-4 md:gap-6 mt-1.5 sm:mt-2 md:mt-3 justify-center">
      {renderAction(Cancel02FreeIcons, "bg-primary-pink", onReject, "", "Skip")}
      {renderAction(
        StarIcon,
        isBookmarked ? "bg-yellow-400" : "bg-primary-cyan",
        onBookmark,
        isBookmarked ? "black" : "",
        isBookmarked ? "Bookmarked" : "Bookmark",
      )}
      {renderAction(
        Tick03FreeIcons,
        "bg-primary-green",
        onAccept,
        "",
        "Connect",
      )}
    </div>
  );
};

export default FeedCardActions;
