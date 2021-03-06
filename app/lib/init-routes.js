'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');

  app.all('*', users.lookup);

  app.get('/', dbg, home.index);

  app.post('/login', dbg, users.login);
  app.post('/register', dbg, users.register);
  app.get('/dashboard', dbg, users.dashboard);
  app.get('/profile/:id/setup', dbg, users.profileEdit);
  app.post('/profile/:id/setup', dbg, users.update);
  app.get('/profile/:id', dbg, users.profile);

  console.log('Routes Loaded');
  fn();
}
