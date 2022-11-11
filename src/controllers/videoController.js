import dideo from "../models/video";
import User from "../models/user";
// video.find({}, (error, videos) => {]
// static 을 이용해서 formatHashtags를 import 하지 않아도 dideo만 import 하면 끝
// dideo.format~~ 로 써도 됨
export const homepageVideos = async (req, res) => {
    // synchronous 상황을 해야 await 가능 cuz await은 문법상 funtion에서만 활용가능
    const videos = await dideo.find({})
        .sort({ createdAt: "desc" })
        .populate("owner");;
    return res.render("home", { pageTitle: `The Korean Leaguer`, videos });
}

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await dideo.findById(id).populate("owner");
    // mongoose의 도움으로 populate에 rerationship만 해주면 알아서 채워준다.

    if (!video) {
        return res.render("404", { pageTitle: "Video Not Found..!" });
    }
    return res.render("watch", { pageTitle: video.title, video });
}
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    const video = await dideo.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video Not Found..!" });
    }
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    return res.render("edit", { pageTitle: `Edit : ${video.title}`, video });
}

export const postEdit = async (req, res) => {
    const {
        user: { _id },
    } = req.session;
    const { id } = req.params;
    const { title, description, hashtags } = req.body
    const video = await dideo.exists({ _id: id });
    // find mongoose id (property) = const id (any)
    if (!video) {
        return res.render("404", { pageTitle: "Video Not Found..!" });
    }
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await dideo.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: dideo.formatHashtags(hashtags)
    })

    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" })
}

export const postUpload = async (req, res) => {
    const { user: { _id }, } = req.session;
    const { path: fileUrl } = req.file
    const { title, hashtags, description } = req.body;
    try {
        const newVideo = await dideo.create(
            {
                title,
                fileUrl,
                description,
                createdAt: Date.now(),
                owner: _id,
                hashtags: dideo.formatHashtags(hashtags),
            }
        )
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    }

    catch (error) {
        console.log(error);
        return res.status(400).render("upload",
            {
                pageTitle: "Upload Video",
                errorMessage: error._message
            })
    }
};

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    const video = await dideo.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await dideo.findByIdAndDelete(id);
    // delete video
    // what is diffrent by remove and delete?
    // remove is permanent delete in sever so we need do delete in findByIdAndDelete!
    return res.redirect("/");

}

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await dideo.find({
            title: {
                $regex: new RegExp(keyword, "i"),
            },
        }).populate("owner");
    }
    return res.render("search", { pageTitle: "Search", videos });
}