import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "The Korean Leaguer";
    res.locals.loggedInUser = req.session.user || {};
    // user가 없다면 빈 object를 소환
    next();
};

export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    }
    else {
        req.flash("error", "Log in first.");
        return res.redirect("/login");
    }
};



export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        next();
    }
    else {
        req.flash("error", "Not Allowed");
        return res.redirect("/")
    }
};


// locals는 templete이 local object에 접근할 수 있게 해주는 장치이다.
// pug에서 마음껏 퍼갈 수 있음.

export const avatarUpload = multer({
    dest: "uploads/avartars/", limits: {
        fileSize: 10000000000000000000,

    }
});
export const videoUpload = multer({
    dest: "uploads/videos/", limits: {
        fileSize: 100000000000000000000000,

    }
})