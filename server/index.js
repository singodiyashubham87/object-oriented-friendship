const PORT = process.env.PORT || 8000;
import app from "./src/app";
import startServer from "./src/server";

startServer(app, PORT);
