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
videoSchema.pre('save',async function(){
    this.hashtags = this.hashtags[0]
    .split(",")
    .map(word=>
        (word.startsWith('#')
        ?
        word:`#${word}`))

    
})
// we save that hashtags before save the db, we creat that '#' 
// in every single word before save in db
// for example if i save this.title="lalala" every single title that i save changing lalala

const dideo = mongoose.model("video", videoSchema);

export default dideo;