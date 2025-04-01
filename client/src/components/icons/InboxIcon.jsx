const InboxIcon = ({ color = "#92918D" }) => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 39 37"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby="inboxIconTitle"
  >
    <title id="inboxIconTitle">Inbox</title>
    <rect
      x="7.01953"
      y="9.47223"
      width="25"
      height="18.0556"
      rx="2"
      stroke={color}
      strokeWidth="2"
    />
    <path
      d="M18.6519 19.5869L7.01953 13.9861V25.5278C7.01953 26.6324 7.91496 27.5278 9.01953 27.5278H30.0195C31.1241 27.5278 32.0195 26.6324 32.0195 25.5278V13.9861L20.3872 19.5869C19.8389 19.8509 19.2002 19.8509 18.6519 19.5869Z"
      fill={color}
    />
  </svg>
);

export default InboxIcon;
