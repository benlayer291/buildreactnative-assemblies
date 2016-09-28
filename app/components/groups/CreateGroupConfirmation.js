'use strict';

import React, { Component } from 'react';
import { 
  View, 
  Text 
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';

import BackButton from '../shared/BackButton';

import { globals } from '../../styles';

class CreateGroupConfirmation extends Component{
  constructor (){
    super();
    this.goBack = this.goBack.bind(this);
  }

  goBack (){
    this.props.navigator.pop();
  }

  render (){
    let titleConfig = { title: 'Create Group', tintColor: 'white' };
    
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          title={titleConfig}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        <View style={globals.flexCenter}>
          <Text style={globals.h2}>
            CreateGroupConfirmation
          </Text>
        </View>
      </View>
    );
  }
};

export default CreateGroupConfirmation;