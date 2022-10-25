export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = (req, res) => {
    console.log(req.body);
};
export const edit = (req, res) => res.send("edit user");
export const remove = (req, res) => res.send("remove");
export const login = (req, res) => res.send("login");
export const logout = (req, res) => res.send("log out!");
export const see = (req, res) => res.send("see the profile");