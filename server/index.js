const PORT = process.env.PORT || 8000;
import app from "./src/app.js";

app.listen(PORT, () => {
	console.log("Server started at port:", PORT);
});
