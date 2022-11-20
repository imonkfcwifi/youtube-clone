import express from "express";
import morgan from "morgan";
import session from "express-session";
import Mongostore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";


const app = express();
const morganMiddleware = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(morganMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 20000,
    },

    store: Mongostore.create({ mongoUrl: process.env.DB_URL }),
}));
app.use("/static", express.static("assets"));
app.use("/uploads", express.static("uploads"));
app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
});
// 이로서 알게된 사실 : middle ware 의 next를 잘 활용해서 해야한다.
// 기존에 존재하던 req.res와 달리 express의 middleware를 활용하는 부분에서 몇가지를 쓸때는
// 최종 return 하기전 next를 해줘야 다음 middleware로 넘어갈수있기 때문이다.

//ex 
// const server = http.createServer((req, res) => { // 이 함수는 그냥 처리결과를 하기위한 콜백함수});

app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);
export default app;