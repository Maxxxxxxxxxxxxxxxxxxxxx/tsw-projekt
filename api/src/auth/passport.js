import { Strategy as LocalStrategy } from "passport-local";
import * as userModel from "../db/model/user";
import hash from "./hash";
import passport from "passport";

// param "user" is user database object
passport.serializeUser(async function (user, done) {
  done(null, user);
});

// what gets exposed in router
passport.deserializeUser(function (user, done) {
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
