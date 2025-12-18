import { size } from "lodash-es";
import { Fragment } from "react";
import { Tooltip } from "react-tooltip";

const NameWithTooltip = ({ name = "Unknown", index, charLimit = 15 }) => {
  const shouldTruncate = size(name) > charLimit;

  return (
    <Fragment>
      <p
        className="text-primary-silver text-[12px] sm:text-sm font-semibold text-center whitespace-nowrap truncate max-w-full"
        data-tooltip-id={`tooltip-${index}`}
      >
        {shouldTruncate ? `${name.slice(0, charLimit)}...` : name}
      </p>
      <Tooltip
        id={`tooltip-${index}`}
        place="top"
        style={{ fontSize: "12px", padding: "4px 8px" }}
      >
        {name}
      </Tooltip>
    </Fragment>
  );
};

export default NameWithTooltip;
