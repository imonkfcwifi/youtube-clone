import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;
const hadleOpen = () => console.log("✅ now you connected that sever database");
const handleError = () => console.log("❓ error!!!");
db.on("error", handleError);
db.once("open", hadleOpen);

// let's go!
