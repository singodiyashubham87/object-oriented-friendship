import { Link } from "react-router-dom";

const RequestButtons = ({ isReceivedRoute, isSentRoute }) => {
  return (
    <div className="absolute top-[5rem] left-[-100%] bg-primary-silver font-primary flex border border-gray-300 rounded-custom-xs w-44">
      <Link
        to="/sent-requests"
        className={`uppercase font-semibold flex-1 py-1 text-center rounded-custom-xs transition-all duration-300 ${
          isSentRoute
            ? "bg-primary-dark text-primary-silver"
            : "bg-primary-silver text-primary-dark"
        }`}
      >
        sent
      </Link>
      <Link
        to="/received-requests"
        className={`uppercase font-semibold flex-1 py-1 text-center rounded-custom-xs transition-all duration-300 ${
          isReceivedRoute
            ? "bg-primary-dark text-primary-silver"
            : "bg-primary-silver text-primary-dark"
        }`}
      >
        received
      </Link>
    </div>
  );
};
export default RequestButtons;
