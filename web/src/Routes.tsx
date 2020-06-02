import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

import { Home } from './views/Home';
import { Login } from './views/Login';
import { Register } from './views/Register';
import { Bye } from './views/Bye';

export const Routes: React.FC = () => {
  return (
    <BrowserRouter>
    <div>
      <header>
      <div><Link to="/">Home</Link></div>
        <div><Link to="/register">Register</Link></div>
        <div><Link to="/login">Login</Link></div>
        <div><Link to="/bye">Bye</Link></div>
      </header>
    </div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/bye" component={Bye} />
      </Switch>
    </BrowserRouter>
  );
}
