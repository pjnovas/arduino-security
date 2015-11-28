import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { auth as config } from 'config.json';

export default function() {

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  passport.use(new LocalStrategy(function(username, password, done) {
    process.nextTick(function() {

      if (username === config.user && password === config.pass ){
        return done(null, { username: username, password: password });
      }

      done(null, false);
    });

  }));

};
