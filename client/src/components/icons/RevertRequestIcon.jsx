const RevertRequestIcon = ({ color = "#AF5656", size = "16" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title id="revertIcon">Revert request icon</title>
    <circle
      cx="7.5"
      cy="7.5"
      r="5.625"
      fill={color}
      stroke="black"
      strokeWidth="0.5"
    />
    <path d="M5 7.5H10" stroke="#222222" strokeWidth="1.2" />
  </svg>
);

export default RevertRequestIcon;
