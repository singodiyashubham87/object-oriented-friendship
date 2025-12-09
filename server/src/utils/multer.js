import multer from "multer";

const ONE_MB = 1 * 1024 * 1024;
const MULTER_LIMITS = {
  fileSize: 5 * ONE_MB, // 5MB limit
};

// Configure multer for memory storage
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: MULTER_LIMITS,
});
