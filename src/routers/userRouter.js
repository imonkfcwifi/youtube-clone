import express from "express";
import { see, logout, startGithubLogin, finishGithubLogin, postEdit, getEdit } from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";
const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
// middleware를 사용하여 login 되어있는 user들만 해당 router로 갈 수 있어야 한다.
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).get(postEdit);
// 어떤 https method를 사용하던간에 해당 middleware를 사용한다.
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);

userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", see);
export default userRouter;