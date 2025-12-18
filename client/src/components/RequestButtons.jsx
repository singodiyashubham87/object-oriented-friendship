import { Link } from "react-router-dom";

const RequestButtons = ({ isReceivedRoute, isSentRoute }) => {
  return (
    <div className="absolute top-[5rem] right-0 bg-primary-silver font-primary flex border border-gray-300 rounded-custom-xs w-40 sm:w-44 md:w-48 lg:w-52">
      <Link
        to="/sent-requests"
        className={`uppercase font-semibold flex-1 py-1.5 px-2 text-xs sm:text-sm text-center rounded-custom-xs transition-all duration-300 ${
          isSentRoute
            ? "bg-primary-dark text-primary-silver"
            : "bg-primary-silver text-primary-dark"
        }`}
      >
        sent
      </Link>
      <Link
        to="/received-requests"
        className={`uppercase font-semibold flex-1 py-1.5 px-2 text-xs sm:text-sm text-center rounded-custom-xs transition-all duration-300 whitespace-nowrap ${
          isReceivedRoute
            ? "bg-primary-dark text-primary-silver"
            : "bg-primary-silver text-primary-dark"
        }`}
      >
        <span className="hidden sm:inline">received</span>
        <span className="sm:hidden">rcvd</span>
      </Link>
    </div>
  );
};
export default RequestButtons;
