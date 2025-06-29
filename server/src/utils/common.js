import { NODE_ENV } from "../enums/nodeEnvironment.js";

export const isProd = process.env.NODE_ENV === NODE_ENV.PRODUCTION;
