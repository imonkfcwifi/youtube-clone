import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxLength: 20 },
    description: { type: String, required: true, trim: true, maxLength: 150 },
    createdAt: { type: Date, require: true, default: Date.now },
    hashtags: [{ type: String, trim: true }],
    meta: {
        views: { type: Number, default: 0, required: true },
        rating: { type: Number, default: 0, required: true },

    },
});
// The more specific the data / / the better to catch errors
// db, html both need schma type
const dideo = mongoose.model("video", videoSchema);

export default dideo;