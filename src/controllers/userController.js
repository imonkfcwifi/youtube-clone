import User from "../models/user";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
    console.log(req.body);
    const { name, username, email, password, location } = req.body;
    const usernameExists = await User.exists({ username });
    const emailExist = await User.exists({ email });
    const pageTitle = "Join";
    if (usernameExists) {
        return res.render("join", {
            pageTitle, errorMessage: "이미 존재하는 닉네임 입니다."
        });
    }
    if (emailExist) {
        return res.render("join", {
            pageTitle, errorMessage: "이미 존재하는 이메일 입니다."
        });

    }
    await User.create({
        name, username, email, password, location,

    });
    return res.redirect("/login");
};
export const edit = (req, res) => res.send("edit user");
export const remove = (req, res) => res.send("remove");
export const login = (req, res) => res.send("login");
export const logout = (req, res) => res.send("log out!");
export const see = (req, res) => res.send("see the profile");