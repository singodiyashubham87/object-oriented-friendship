import { Cancel01FreeIcons, StarIcon } from "@hugeicons/core-free-icons";
import { Tick03FreeIcons } from "@hugeicons/core-free-icons/index";
import { HugeiconsIcon } from "@hugeicons/react";

const FeedCardActions = ({ onReject, onBookmark, onAccept, isBookmarked }) => {
  const renderAction = (icon, colorClass, handler, fill = "", title = "") => {
    if (!handler) {
      return (
        <div
          className={`p-2 ${colorClass} rounded-full border-xs border-primary-dark`}
          title={title}
        >
          <HugeiconsIcon icon={icon} size={26} fill={fill} />
        </div>
      );
    }
    return (
      <button
        type="button"
        onClick={handler}
        className={`p-2 ${colorClass} hover:opacity-90 rounded-full border-xs border-primary-dark cursor-pointer`}
        title={title}
      >
        <HugeiconsIcon icon={icon} size={26} fill={fill} />
      </button>
    );
  };

  return (
    <div className="buttons flex gap-8 mt-4 justify-center">
      {renderAction(
        Cancel01FreeIcons,
        "bg-primary-pink",
        onReject,
        "",
        "Reject",
      )}
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
        "Accept",
      )}
    </div>
  );
};

export default FeedCardActions;
