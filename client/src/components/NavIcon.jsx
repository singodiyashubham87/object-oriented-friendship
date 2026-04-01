import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

const NavIcon = ({
  href,
  IconComponent,
  iconName,
  hoveredIcon,
  isAppRoute = true,
  onClick = () => {},
  setHoveredIcon,
  isActive,
  showBadge = false,
}) => {
  const iconDiv = (
    <div
      className={`relative p-1 rounded-custom-xs ease-in duration-200 ${
        isActive
          ? "bg-secondary-silver"
          : "bg-secondary-dark hover:bg-secondary-silver"
      }`}
      onMouseEnter={() => setHoveredIcon(iconName)}
      onMouseLeave={() => setHoveredIcon(null)}
    >
      <HugeiconsIcon
        icon={IconComponent}
        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
        color={isActive || hoveredIcon === iconName ? "#373737" : "#92918D"}
      />
      {showBadge && (
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border border-dark animate-pulse" />
      )}
    </div>
  );

  return (
    <li>
      {isAppRoute ? (
        <Link to={href} onClick={onClick}>
          {iconDiv}
        </Link>
      ) : (
        <button
          type="button"
          className="bg-transparent border-0 p-0 m-0 cursor-pointer"
          onClick={onClick}
        >
          {iconDiv}
        </button>
      )}
    </li>
  );
};

export default NavIcon;
