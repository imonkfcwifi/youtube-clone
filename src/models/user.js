import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String, required: true },
    location: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    githubId: { type: Boolean, default: false },
    avatarUrl: { type: String },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "video" }],
    // mongoose 자체 engine으로 schema를 저장하므로 인수인 const 'dideo' 가 아닌 video 로 저장된 video를 사용해야함.
});

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 5);
    }
});

// 서로 나뉘어져 있던 콜렉션들을 서로 연결하기! 비디오 db에는 생산자 id를 넣어주고 유저 db에는 유저가 만든 비디오 id를 넣어주고


const User = mongoose.model("User", userSchema);
export default User;