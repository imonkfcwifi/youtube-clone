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
    try {
        await User.create({
            name, username, email, password, location,

        })
    } catch (error) {
        console.log(error);
        return res.status(400).render("join",
            {
                pageTitle: "Upload Video",
                errorMessage: error._message
            })
    }
    return res.redirect("/login");
};

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const exist = await User.exist({ username });
    if (!exist) {
        return res.status(400).render("login", { pageTitle: "Login", errorMessage: "없는 아이디 입니다." })
    }
    // check if aacount exit
    //  check if password exit
    res.end();
}
export const edit = (req, res) => res.send("edit user");
export const remove = (req, res) => res.send("remove");
export const getLogin = (req, res) => res.send("getLogin");
export const logout = (req, res) => res.send("log out!");
export const see = (req, res) => res.send("see the profile");