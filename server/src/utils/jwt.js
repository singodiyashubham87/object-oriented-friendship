import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "oof_secret";
const JWT_EXPIRES_IN = "7d";

export const generateToken = (payload, expiresIn = JWT_EXPIRES_IN) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
