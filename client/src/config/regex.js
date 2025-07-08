// This regex will match passwords having at least one lowercase, one uppercase character and one symbol
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
// Alphanumeric and underscores, at least 3 characters
const userNameRegex = /^[a-zA-Z0-9_]{3,}$/;

export { strongPasswordRegex, userNameRegex };
