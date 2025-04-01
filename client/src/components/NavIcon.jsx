import { Link } from "react-router-dom";

const NavIcon = ({
  href,
  IconComponent,
  iconName,
  hoveredIcon,
  setHoveredIcon,
  isActive,
}) => {
  return (
    <li>
      <Link to={href}>
        <div
          className={`p-1 rounded-custom-xs ease-in duration-200 ${
            isActive
              ? "bg-secondary-silver"
              : "bg-secondary-dark hover:bg-secondary-silver"
          }`}
          onMouseEnter={() => setHoveredIcon(iconName)}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          <IconComponent
            color={isActive || hoveredIcon === iconName ? "#373737" : "#92918D"}
          />
        </div>
      </Link>
    </li>
  );
};

export default NavIcon;
