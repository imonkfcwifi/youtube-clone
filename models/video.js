import mongoose from "mongoose";

// export const formatHashtags = (hashtags) =>
//     hashtags.split(",").map
//     (
//     (word)=>
//     (word.startsWith("#")? 
//     word:`#${word}`)
//     )

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

videoSchema.static('formatHashtags',function(hashtags){
    return  hashtags.split(",").map
    (
        (word)=>
        (word.startsWith("#")? 
        word:`#${word}`)
        )
        
        // // 1. findByIdAndUpdate()에서는 save 훅업이 발생하지 않음 => 다른 방법을 알아보자
        // 2. Video.js에 function을 만들어서 관리하기 => 이것도 괜찮음 근데 다른것도 알아보자
        // 3. static을 사용하면 import 없이도 Model.function()형태로 사용이 가능함 => super cool
    })

// The more specific the data / / the better to catch errors
// db, html both need schma type


const dideo = mongoose.model("video", videoSchema);

export default dideo;