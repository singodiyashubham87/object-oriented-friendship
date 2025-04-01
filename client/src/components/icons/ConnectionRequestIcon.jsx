const ConnectionRequestIcon = ({
  userColor = "#273B4A",
  plusSignColor = "#25221B",
  size = "16",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="requestIconTitle">Connection Request Icon</title>
      <circle
        cx="7.5"
        cy="5"
        r="2.5"
        fill={userColor}
        stroke={plusSignColor}
        strokeWidth="0.2"
        strokeLinecap="round"
      />
      <mask id="path-2-inside-1_95_1377" fill="white">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.5 8.125C5.28083 8.125 3.44757 9.54121 3.16328 11.3767C3.12101 11.6496 3.34885 11.875 3.625 11.875H11.375C11.6511 11.875 11.879 11.6496 11.8367 11.3767C11.5524 9.54121 9.71916 8.125 7.5 8.125Z"
        />
      </mask>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 8.125C5.28083 8.125 3.44757 9.54121 3.16328 11.3767C3.12101 11.6496 3.34885 11.875 3.625 11.875H11.375C11.6511 11.875 11.879 11.6496 11.8367 11.3767C11.5524 9.54121 9.71916 8.125 7.5 8.125Z"
        fill={userColor}
      />
      <path
        d="M11.8367 11.3767L12.0344 11.3461L11.8367 11.3767ZM3.36092 11.4074C3.62697 9.68967 5.35734 8.325 7.5 8.325V7.925C5.20432 7.925 3.26818 9.39276 2.96563 11.3461L3.36092 11.4074ZM11.375 11.675H3.625V12.075H11.375V11.675ZM7.5 8.325C9.64265 8.325 11.373 9.68967 11.6391 11.4074L12.0344 11.3461C11.7318 9.39276 9.79567 7.925 7.5 7.925V8.325ZM11.375 12.075C11.7517 12.075 12.0986 11.7611 12.0344 11.3461L11.6391 11.4074C11.6593 11.5382 11.5506 11.675 11.375 11.675V12.075ZM2.96563 11.3461C2.90136 11.7611 3.24828 12.075 3.625 12.075V11.675C3.44943 11.675 3.34066 11.5382 3.36092 11.4074L2.96563 11.3461Z"
        fill={plusSignColor}
        mask="url(#path-2-inside-1_95_1377)"
      />
      <path d="M11.5 8V11" stroke="#33363F" strokeLinecap="round" />
      <path d="M10 9.5H13" stroke="#33363F" strokeLinecap="round" />
    </svg>
  );
};

export default ConnectionRequestIcon;
