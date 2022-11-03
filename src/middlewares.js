export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "The Korean Leaguer";
    res.locals.loggedInUser = req.session.user || {};
    // user가 없다면 빈 object를 소환
    next();
};


// locals는 templete이 local object에 접근할 수 있게 해주는 장치이다.
// pug에서 마음껏 퍼갈 수 있음.
