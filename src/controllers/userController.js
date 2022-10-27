import User from "../models/user";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
    console.log(req.body);
    const { name, username, email, password1, password2, location } = req.body;
    const exists = await User.exists({ $or: [{ username }, { email }] });
    const pageTitle = "Join";
    if (password1 !== password2) {
        return res.status(400).render("join", {
            pageTitle, errorMessage: "비밀번호가 일치하지 않습니다."
        });
    }
    if ({ exists }) {
        return res.status(400).render("join", {
            pageTitle, errorMessage: "중복된 email/id 입니다."
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