import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/youtube");

const db = mongoose.connection;
const hadleOpen = () => console.log("✅ now you connected that sever database");
const handleError = () => console.log("❓ error!!!");
db.on("error", handleError);
db.once("open", hadleOpen);

// let's go!