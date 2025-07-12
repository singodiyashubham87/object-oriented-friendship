import { size } from "lodash-es";
import { Fragment } from "react";
import { Tooltip } from "react-tooltip";

const NameWithTooltip = ({ name = "Unknown", index }) => {
  return (
    <Fragment>
      {size(name) > 10 ? (
        <Fragment>
          <p
            className="text-primary-silver text-base font-semibold truncate max-w-[120px] text-center"
            data-tooltip-id={`tooltip-${index}`}
          >
            {`${name.slice(0, 10)}...`}
          </p>
          <Tooltip id={`tooltip-${index}`} place="top" effect="solid">
            {name}
          </Tooltip>
        </Fragment>
      ) : (
        <span className="text-primary-silver text-base font-semibold text-center">
          {name}
        </span>
      )}
    </Fragment>
  );
};

export default NameWithTooltip;
