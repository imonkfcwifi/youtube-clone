import express from "express";
import { see, logout, startGithubLogin, finishGithubLogin, postEdit, getEdit } from "../controllers/userController";
const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.route("/edit").get(getEdit).get(postEdit);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/:id", see);
export default userRouter;