import auth from "./routers/auth";
import express from "express";
import cookieParser from "cookie-parser";
import passport from "./auth/passport";
import expressSession from "express-session";
import { createServer } from "node:https";
import { readFileSync } from "node:fs";

const apiPort = process.env.API_PORT || 3000;
const apiHost = process.env.API_HOST || "localhost";
const cookiesSecret = process.env.COOKIE_SECRET || "sekretCookie";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  expressSession({
    cookie: {
      maxAge: 2137000000,
      secure: true,
    },
    saveUninitialized: false,
    resave: false,
    secret: cookiesSecret,
    name: "session.id",
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/api/auth", auth);

const server = createServer(
  {
    passphrase: "krowa12",
    key: readFileSync("./ssl/key.pem"),
    cert: readFileSync("./ssl/cert.pem"),
  },
  app
);

server.listen(apiPort, () => {
  console.log(`Server available from: https://${apiHost}:${apiPort}`);
});

// app.set("view engine", "ejs");
