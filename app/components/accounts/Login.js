'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';

import { extend } from 'underscore';

import { API, DEV } from '../../config';
import { Headers } from '../../fixtures';

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import BackButton from '../shared/BackButton';

import Colors from '../../styles/colors';
import { globals, formStyles } from '../../styles';

const styles = formStyles;

class Login extends Component{
  constructor(){
    super();
    this.goBack = this.goBack.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.state = {
      email: '',
      password: '',
      errorMsg: '',
    };
  }

  goBack(){
    this.props.navigator.pop();
  }

  loginUser() {
    if (DEV) { console.log('Logging in...'); }

    fetch(`${API}/users/login`, {
      method: 'POST',
      headers: Headers,
      body: JSON.stringify({
        username: this.state.email,
        password: this.state.password
      })
    })
    .then(response => response.json())
    .then(data => this.loginStatus(data))
    .catch(err => this.connectionError(err))
    .done();
  }

  loginStatus(response) {
    if (DEV) { console.log('Login status', response)}
    if (response.status === 401){
      this.setState({ errorMsg: 'Email or password was incorrect.' });
    } else {
      this.fetchUserInfo(response.id)
    }
  }

  fetchUserInfo(sid){
    if (DEV) { console.log('Getting current user info', sid) }
    // store user session id in 'localStorage'  
    AsyncStorage.setItem('sid', sid);

    fetch(`${API}/users/me`, { 
      method: 'GET',
      headers: extend(Headers, { 'Set-Cookie': `sid=${sid}`}) 
    })
    .then(response => response.json())
    .then(user => this.updateUserInfo(user))
    .catch(err => this.connectionError(err))
    .done();
  }

  updateUserInfo(user){
    if (DEV) { console.log('Logged in user:', user); }
    this.props.updateUser(user);
    this.props.navigator.push({ name: 'Dashboard' })
  }

  connectionError(err){
    if (DEV) { console.log('Connection error', err); }
    this.setState({ errorMsg: 'Connection error.'})
  }

  changeEmail(email){
    this.setState({ email })
  }

  changePassword(password){
    this.setState({ password })
  }

  render(){
    let titleConfig = { title: 'Login', tintColor: 'white' };
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          leftButton={<BackButton handlePress={this.goBack} />}
          title={titleConfig}
          tintColor={Colors.brandPrimary}
        />
        <ScrollView style={styles.container}>
          <Text style={styles.h3}>
            Login with your email and password.
          </Text>
          <Text style={styles.h4}>
            Email
          </Text>
          <View style={styles.formField}>
            <TextInput
              autoFocus={true}
              returnKeyType="next"
              onSubmitEditing={() => this.password.focus()}
              onChangeText={this.changeEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={140}
              placeholderTextColor={Colors.copyMedium}
              style={styles.input}
              placeholder="Your email address"
            />
          </View>
          <Text style={styles.h4}>Password</Text>
          <View style={styles.formField}>
            <TextInput
              ref={(el) => this.password = el }
              returnKeyType="next"
              onChangeText={this.changePassword}
              secureTextEntry={true}
              autoCapitalize="none"
              maxLength={140}
              placeholderTextColor={Colors.copyMedium}
              style={styles.input}
              placeholder="Your password"
            />
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {this.state.errorMsg}
            </Text>
          </View>
        </ScrollView>
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={this.loginUser}
        >
          <Text style={globals.largeButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    )
  }
};

export default Login;