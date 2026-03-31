import app from "./src/app.js";
import { setupSocket } from "./src/socket.js";

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.info("Server started at port:", PORT);
});

setupSocket(server);
