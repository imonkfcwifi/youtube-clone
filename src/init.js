import "regenerator-runtime";
import "dotenv/config";
// require('dotenv').config; 을 import 한다.
import "./db";
import "./models/video";
import "./models/user";
import "./models/Comment";
import app from "./server";

const PORT = process.env.PORT || 4000;

const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
