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
export const postEdit = async (req, res) => {
    const {
        session: {
            user: { _id, email: sessionEmail, username: sessionUsername, avatarUrl },
        },
        body: { name, email, username, location }, file,
    } = req;
    console.log(file);
    let searchParam = [];
    if (sessionEmail !== email) {
        searchParam.push({ email });
    }
    if (sessionUsername !== username) {
        searchParam.push({ username });
    }
    if (searchParam.length > 0) {
        const foundUser = await User.findOne({ $or: searchParam });
        if (foundUser && foundUser._id.toString() !== _id) {
            return res.status(HTTP_BAD_REQUEST).render("edit-profile", {
                pageTitle: "Edit Profile",
                errorMessage: "This username/email is already taken.",
            });
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            avatarUrl: file ? file.path : avatarUrl,
            // if file exist, (user send form a file) we going to use file.path
            // if file doesn't exist (user donot send form a file) we use avatarUrl in session (old)
            name,
            email,
            username,
            location,
        },
        { new: true }
    );
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
};


export const getChangePassword = (req, res) => {
    if (req.session.user.githubId === true) {
        return res.redirect("/");
    }
    return res.status(400).render("users/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
    const {
        session: {
            user: { _id },
        },
        body: { oldPassword,
            newPassword,
            newPasswordConfirmation },
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    // await 이므로 password를 submit 하면 db에 있는 id에 새로 update 된 user.pass로 comepare 할 수 있게 된다 즉 session 에 있는 password를 생각하지 않아도 된다ㅣ.\
    if (oldPassword === newPassword) {
        return res.status(400).render('users/change-password', {
            pageTitle,
            errorMessage: 'The old password equals new password',
        });
    }
    if (!ok) {
        return res.render("users/change-password",
            {
                pageTitle: " Change Password",
                errorMessage: "The current password does not the match"
            })
    }
    if (newPassword !== newPasswordConfirmation) {
        return res.render("users/change-password",
            {
                pageTitle: " Change Password",
                errorMessage: "The new password does not the match"
            })
    }
    // send notification

    user.password = newPassword
    await user.save();
    // promise => await, db에 저장하는데 시간이 걸리기 때문에
    return res.redirect("/users/logout");
};


export const see = async (req, res) => {
    const { id } = req.params;
    // why not req.session.user._id ? => cuz we need pulic information so we need to get id from url (params)
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).render("404", { pageTitle: "Erorr : User not founded" });
    }
    return res.render("users/profile", { pageTitle: `${user.name} 의 Profile`, user });
}