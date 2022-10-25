import "./db";
import "./models/video";
import app from "./server";
import User from "./models/user";

const PORT = 4000;

const handleListening = () =>
    console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);