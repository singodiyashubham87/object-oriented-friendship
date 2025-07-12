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
}) => {
  const iconDiv = (
    <div
      className={`p-1 rounded-custom-xs ease-in duration-200 ${
        isActive
          ? "bg-secondary-silver"
          : "bg-secondary-dark hover:bg-secondary-silver"
      }`}
      onMouseEnter={() => setHoveredIcon(iconName)}
      onMouseLeave={() => setHoveredIcon(null)}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick(e);
        }
      }}
    >
      <IconComponent
        color={isActive || hoveredIcon === iconName ? "#373737" : "#92918D"}
      />
    </div>
  );

  return (
    <li>
      {isAppRoute ? (
        <Link to={href}>{iconDiv}</Link>
      ) : (
        <button
          type="button"
          style={{ background: "none", border: "none", padding: 0, margin: 0 }}
          onClick={onClick}
          onMouseEnter={() => setHoveredIcon(iconName)}
          onMouseLeave={() => setHoveredIcon(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClick(e);
            }
          }}
        >
          {iconDiv}
        </button>
      )}
    </li>
  );
};

export default NavIcon;
