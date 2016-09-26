'use strict';

import React, { Component } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import Colors from '../styles/colors';
import { globals, landingStyles } from '../styles';

const styles = landingStyles;

class Landing extends Component {
  constructor() {
    super();
    this.visitLogin = this.visitLogin.bind(this);
    this.visitRegister = this.visitRegister.bind(this);
  }

  visitLogin() {
    this.props.navigator.push({
      name: 'Login'
    });
  }

  visitRegister() {
    this.props.navigator.push({
      name: 'Register'
    });
  }

  render() {
    let titleConfig = { title: 'Landing', tintColor: 'white' };

    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Image
            style={styles.backgroundImage}
            source={require('../assets/images/welcome@2x.png')}
          />
        </View>
        <View style={globals.flexCenter}>
          <Image
            style={styles.logo}
            source={require('../assets/images/logo.png')}
          />
          <Text style={[globals.lightText, globals.h2, globals.mb2]}>
            assemblies
          </Text>
          <Text style={[globals.lightText, globals.h4]}>
            Where Developers Connect
          </Text>
        </View>
        <TouchableOpacity
          style={[globals.button, globals.inactive, styles.loginButton]}
          onPress={this.visitLogin}
        >
          <Icon style={styles.icon} name='ios-lock' size={36} color={Colors.brandPrimary} />
          <Text style={[globals.buttonText, globals.primaryText]}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={globals.button}
          onPress={this.visitRegister}
        >
          <Icon style={styles.icon} name='ios-person' size={36} color='white' />
          <Text style={globals.buttonText}>
            Create an account
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Landing;