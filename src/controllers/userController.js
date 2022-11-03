import User from "../models/user";
import fetch from "node-fetch";
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

    const user = await User.findOne({ username, githubId: false });

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
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (await fetch(finalUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    })).json();
    // 원문은 두번 써야 했음 const json = await tokenRequest.json
    // await( await fetch & 유저가 받는 토큰).json()

    if ("access_token" in tokenRequest)
    // 즉 여기서 "access_token in json (const로 만든 상수값) 대신 한번에 묶은 tokenRequest를 사용"
    {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com"
        // gitgub에서 data를

        const userData = await (

            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();

        console.log(userData);
        const emailData = await (await fetch(`${apiUrl}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`,
            }
        })).json();
        // await( await fetch & 깃헙에 유저보내는 토큰).JSON => 즉 fetch 요청 후 fetch에 있는 내용의 JSOn을 받게 됨
        console.log(emailData);
        const emailObj = emailData.find(

            (email) => email.primary === true && email.verified === true

        )
        if (!emailObj) {

            return res.redirect("/login");

        }
        let user = await (User.findOne({ email: emailObj.email }))

        if (!user) {

            user = await User.create({

                name: userData.name,
                username: userData.login,
                email: emailObj.email,
                password: "",
                location: userData.location,
                githubId: true,
                avatarUrl: userData.avatar_url
                // user 발견 못할 시 user에 대한 정의 해주기
                // user.blabla <- blabla part는 userdata의 gitgub에서 준 data 의 object name
            });
        }

        req.session.loggedIn = true;
        // 로그인을 하면 session.loggedIn값이 true가 되도록 한다.
        req.session.user = user;
        // user가 발견한 것들을 session의 user object에 첨가
        return res.redirect("/");
        // github data email로 가입시켜버리기
        // user 발견시 if(!user) 무시후 로그인

    } else {

        return res.redirect("/login");

    }
};
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};
// check if aacount exist
//  check if password exist
export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = (req, res) => {
    return res.render("post-profile", { pageTitle: "post profile" });
};
export const see = (req, res) => res.send("see the profile");