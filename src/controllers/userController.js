import User from "../models/user";
import bcrypt from "bcrypt";
export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
    console.log(req.body);
    const { name, username, email, password, password2, location } = req.body;
    const exists = await User.exists({ $or: [{ username }, { email }] });
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(400).render("join", {
            pageTitle, errorMessage: "비밀번호가 일치하지 않습니다."
        });
    }
    if (exists) {
        return res.status(400).render("join", {
            pageTitle, errorMessage: "중복된 email/id 입니다."
        });
    }
    try {
        await User.create({
            name, username, email, password, location,

        })
        return res.redirect("/login");
    } catch (error) {
        console.log(error);
        return res.status(400).render("join",
            {
                pageTitle: "Upload Video",
                errorMessage: error._message
            })
    }
};

export const getLogin = (req, res) => {
    res.render("login", { pageTitle: "Login" });

}

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(400).render("login",
            { pageTitle, errorMessage: "없는 아이디 입니다." })
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("login",
            {
                pageTitle,
                errorMessage: "Wrong password"
            });
    }
    console.log(`${username} 유저가 로그인 되었습니다.`);
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
}

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email"
    };

    const params = new URLSearchParams(config).toString();

    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    }
    console.log(config);

    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const data = await fetch(finalUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    });
    const json = await data.json();
    console.log(json);
};

// check if aacount exist
//  check if password exist

export const edit = (req, res) => res.send("edit user");
export const remove = (req, res) => res.send("remove");
export const logout = (req, res) => res.send("log out!");
export const see = (req, res) => res.send("see the profile");