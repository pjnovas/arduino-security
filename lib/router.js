
import { Router } from 'express';
import passport from 'passport';

const render = (path, options) => (req, res) => res.render(path, options);

const redirect = route => (req, res) => res.redirect(route);

const checkAuth = (req, res, next) => {
  if (!req.isAuthenticated()){
    return res.redirect("/login");
  }

  next();
};

const logout = (req, res, next) => {
  req.logout();
  next();
};

const appStack = []
  .concat(checkAuth)
  .concat([
    render('index')
  ]);

const app = Router();

app.get('/', appStack);
app.get('/login', render('login'));
app.get('/logout', logout, redirect('/'));

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

export default app;
