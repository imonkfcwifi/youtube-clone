import dideo from "../models/video";
// video.find({}, (error, videos) => {]

export const homepageVideos = async (req, res) => {
    // synchronous 상황을 해야 await 가능 cuz await은 문법상 funtion에서만 활용가능
    const videos = await dideo.find({});
    return res.render("home", { pageTitle: `"SWEET HOME"`, videos });
}

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await dideo.findById(id);
    if (!video) {
        return res.render("404", { pageTitle: "Video Not Found..!" });
    }
    return res.render("watch", { pageTitle: video.title, video });
}
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await dideo.findById(id);
    if (!video) {
        return res.render("404", { pageTitle: "Video Not Found..!" });
    }
    return res.render("edit", { pageTitle: `Edit : ${video.title}`, video });
}

export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    console.log(req.body.title);
    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" })
}

export const postUpload = async (req, res) => {
    const { title, hashtags, description } = req.body;
    try {
        await dideo.create(
            {
                title,
                description,
                createdAt: Date.now(),
                hashtags: hashtags.split(",").map(word => `#${word}`),
            }
        )
        return res.redirect("/");
    }

    catch (error) {
        console.log(error);
        return res.render("upload",
            {
                pageTitle: "Upload Video",
                errorMessage: error._message
            })
    }
};
