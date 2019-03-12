import React, { Component } from 'react';
import { Route } from 'react-router';
import { Home } from './components/Home';
import { Login } from './components/Login';

export default class App extends Component {
  displayName = App.name

  render() {
      return (
        <div>
            <Route exact path='/' component={Login} />
            <Route path='/Home' component={Home} />
        </div>
    );
  }
}
