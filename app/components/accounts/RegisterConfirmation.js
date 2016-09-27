'use strict';

import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity, 
  View,
  Dimensions 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import NavigationBar from 'react-native-navbar';
import Dropdown, { Select, Option, OptionList } from 'react-native-selectme';

import { uniq, extend } from 'underscore';

import { Headers,
  Technologies,
  ImageOptions,
  DefaultAvatar,
} from '../../fixtures';
import { DEV, API } from '../../config';

import { registerError } from '../../utilities';

import BackButton from '../shared/BackButton';
import TechnologyList from '../shared/TechnologyList';

import Colors from '../../styles/colors';
import { 
  formStyles, 
  globals, 
  selectStyles, 
  optionTextStyles, 
  overlayStyles 
} from '../../styles';

const styles = formStyles;
const {
  width: deviceWidth,
  height: deviceHeight
} = Dimensions.get('window');

class RegisterConfirmation extends Component {
  constructor() {
    super();
    this.goBack = this.goBack.bind(this);
    this.removeTechnology = this.removeTechnology.bind(this);
    this.selectTechnology = this.selectTechnology.bind(this);
    this.showImagePicker = this.showImagePicker.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      avatar        : DefaultAvatar,
      errorMsg      : '',
      technologies  : [],
    }
  }

  submitForm() {
    let errorMsg = registerError(this.props);

    if (errorMsg !== '') {
      this.setState({ errorMsg: errorMsg });
      return;
    }

    let user = {
      avatar: this.state.avatar,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      location: this.props.location,
      password: this.props.password,
      technologies: this.state.technologies,
      username: this.props.email,
    };

    fetch(`${API}/users`, {
      method: 'POST',
      headers: Headers,
      body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(user => this.loginUser(this.props.email, this.props.password))
    .catch(err => {})
    .done();
  }

  loginUser(email, password) {
    fetch(`${API}/users/login`, {
      method: 'POST',
      headers: Headers,
      body: JSON.stringify({username: email, password: password})
    })
    .then(response => response.json())
    .then(data => this.getUserInfo(data.id))
    .catch(err => {})
    .done();
  }

  getUserInfo(sid) {
    fetch(`${API}/users`, {
      headers: extend(Headers, { 'Set-Cookie': `sid=${sid}`})
    })
    .then(response => response.json())
    .then(user => {
      this.props.updateUser(user);
      this.props.navigator.push({
        name: 'Dashboard'
      });
    })
    .catch((err) => {})
    .done();
  } 

  showImagePicker() {
    ImagePicker.showImagePicker(ImageOptions, (response) => {
      if (response.didCancel || response.error) { return; }

      const avatar = 'data:image/png;base64,' + response.data;

      this.setState({ avatar: avatar });
    });
  }

  selectTechnology(technology) {
    this.setState({
      technologies: uniq([
        ...this.state.technologies, technology
      ])
    });
  }

  removeTechnology(index) {
    let { technologies } = this.state;
    this.setState({
      technologies: [
        ...technologies.slice(0, index),
        ...technologies.slice(index + 1)
      ]
    })
  }

  goBack() {
    this.props.navigator.pop();
  }

  render() {
    let titleConfig = { title: 'CreateAccount', tintColor: 'white' };

    return (
      <View style={[globals.flex, globals.inactive]}>
        <NavigationBar
          title={titleConfig}
          leftButton={<BackButton handlePress={this.goBack}/>}
          tintColor={Colors.brandPrimary}
        />
        <ScrollView style={styles.container}>
          <View style={globals.flex}>
            <Text style={styles.h4}>
              Select technologies
            </Text>
            <Select
              defaultValue="Add a technology"
              height={55}
              onSelect={this.selectTechnology}
              optionListRef={() => this.options}
              style={selectStyles}
              styleText={optionTextStyles}
              width={deviceWidth}
            >
              {Technologies.map((technology, idx) => (
                <Option 
                  styleText={optionTextStyles} 
                  key={idx}
                >
                  {technology}
                </Option>
              ))}
            </Select>
            <OptionList 
              overlayStyles={overlayStyles} 
              ref={(el) => this.options = el }
            />
          </View>
          <View>
            <TechnologyList 
              technologies={this.state.technologies}
              handlePress={this.removeTechnology} 
            />
          </View>
          <TouchableOpacity 
            style={styles.avatarContainer} 
            onPress={this.showImagePicker}
          >
            <Icon name="ios-camera" size={30} color={Colors.brandPrimary}/>
            <Text style={[styles.h4, globals.primaryText]}>
              Add a Profile Photo
            </Text>
          </TouchableOpacity>
          <View style={styles.avatarImageContainer}>
            <Image 
              source={{uri: this.state.avatar}} 
              style={styles.avatarImage}
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
          onPress={this.submitForm}
        >
          <Text style={globals.largeButtonText}>
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default RegisterConfirmation;