import { Strategy as LocalStrategy } from "passport-local";
import * as userModel from "../db/model/user";
import hash from "./hash";
import passport from "passport";

passport.serializeUser(async function (userId, done) {
  console.log("called serializeUser. userId:", userId);

  // @ts-ignore
  const u = await userModel.get(userId);

  done(null, u.userid);
});

passport.deserializeUser(function (user, done) {
  console.log("called deserializeUser. user:", user);
  done(null, user.userid);
});

passport.use(
  new LocalStrategy(async function (username, password, done) {
    const h = hash(password);
    const res = await userModel.getByUsername(username);

    const u = res[0];

    // console.log(`GIVEN: ${h}\nACTUAL:${u.passwordHash}`);
    // console.log(u);

    if (h != u.passwordHash) return done(null, false);
    if (!u) return done(null, false);

    return done(null, u);
  })
);

export default passport;
