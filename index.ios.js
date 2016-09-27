'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
} from 'react-native';

import Landing from './app/components/Landing';
import Dashboard from './app/components/Dashboard';
import Register from './app/components/accounts/Register';
import RegisterConfirmation from './app/components/accounts/RegisterConfirmation';
import Login from './app/components/accounts/Login';
import { globals } from './app/styles';

class Assemblies extends Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.state = {
      user: null
    };
  }

  logout() {
    this.nav.push({ name: 'Landing' });
    this.updateUser(null);
  }

  updateUser(user) {
    this.setState({ user: user });
  }

  render() {
    return (
      <Navigator
        style={globals.flex}
        ref={ (el) => this.nav = el }
        initialRoute={{ name: 'Landing' }}
        renderScene={(route, navigator) => {
          switch(route.name) {
            case 'Register':
              return (
                <Register navigator={navigator} />
              );
            case 'RegisterConfirmation':
              return (
                <RegisterConfirmation
                  {...route}
                  updateUser={this.updateUser}
                  navigator={navigator}
                />
            );
            case 'Login':
              return (
                <Login 
                  navigator={navigator}
                  updateUser={this.updateUser} 
                />
              );
            case 'Landing':
              return (
                <Landing navigator={navigator} />
              );
            case 'Dashboard':
              return (
                <Dashboard
                  logout={this.logout}
                  updateUser={this.updateUser}
                  navigator={navigator}
                  user={this.state.user}
                />
              );
          }
        }} 
      />
    );
  }
}

AppRegistry.registerComponent('Assemblies', () => Assemblies);
