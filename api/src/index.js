import auth from "./routers/auth";
import posts from "./routers/posts";
import users from "./routers/user";
import cdnStatic from "./routers/cdn-static";
import express from "express";
import cookieParser from "cookie-parser";
import passport from "./auth/passport";
import expressSession from "express-session";
import mongodbSession from "connect-mongodb-session";
import { createServer } from "node:https";
import { readFileSync } from "node:fs";
import path from "path";
import log from "./log";
import { Server } from "socket.io";

const apiPort = process.env.API_PORT || 3000;
const apiHost = process.env.API_HOST || "localhost";
const cookiesSecret = process.env.COOKIE_SECRET || "sekretCookie";
const passphrase = process.env.CERT_PASSPHRASE;
const mongoUri = process.env.MONGO_URI;

const sessionStorage = mongodbSession(expressSession);

const sessionStorageInstance = new sessionStorage({
  // @ts-ignore
  uri: mongoUri,
  collection: "session",
  databaseName: "tsw",
});

const app = express();

app.use(express.static(path.join(__dirname, "static")));

app.use(express.json());
app.use(cookieParser());
app.use(
  expressSession({
    saveUninitialized: false,
    resave: false,
    secret: cookiesSecret,
    name: "sessionId",
    store: sessionStorageInstance,
    cookie: {
      httpOnly: false,
      maxAge: 1000 * 3600,
      secure: true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, set-cookie");
  next();
});

app.use("/api/auth", auth);
app.use("/api/posts", posts);
app.use("/api/static", cdnStatic);
app.use("/api/users", users);

const server = createServer(
  {
    passphrase,
    key: readFileSync("./ssl/key.pem"),
    cert: readFileSync("./ssl/cert.pem"),
  },
  app
);

const io = new Server(server, {
  cors: {
    origin: "https://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("followed", (message) => {
    console.debug(message);
    io.emit("followed", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(apiPort, () => {
  log.info(`Server available from: https://${apiHost}:${apiPort}`);
});

// app.set("view engine", "ejs");
