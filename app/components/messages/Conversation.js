import React, { Component } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity, 
  View,  
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import moment from 'moment';

import { isEqual } from 'underscore';

import { Headers } from '../../fixtures';
import { DEV, API } from '../../config';

import Colors from '../../styles/colors';
import { globals, messagesStyles } from '../../styles';

import BackButton from '../shared/BackButton';

const styles = messagesStyles;

const Message = ({ user, message }) => {
  return (
    <View style={[globals.centeredRow, globals.pt1]}>
      <View>
        <Image 
          style={globals.avatar} 
          source={{uri: user.avatar? user.avatar : DefaultAvatar }} 
        />
      </View>
      <View style={[styles.flexCentered, globals.pv1]}>
        <View style={globals.flexRow}>
          <Text style={styles.h5}>
            {`${user.firstName} ${user.lastName}`}
          </Text>
          <Text style={styles.h6}>
            {moment(new Date(message.createdAt)).fromNow()}
          </Text>
        </View>
        <View style={globals.flexContainer}>
          <Text style={styles.messageText}>
            {message.text}
          </Text>
        </View>
      </View>
    </View>
  );
};

class Conversation extends Component{
  constructor() {
    super();
    this.goBack = this.goBack.bind(this);
    this.createMessage = this.createMessage.bind(this);
    this.state = {
      messages: [],
      message: '',
    }
  }

  componentWillMount() {
    this._loadMessages();
  }

  _loadMessages() {
    let { user, currentUser } = this.props;
    console.log('USER IDs', user.id, currentUser.id);
    let query = {
      $or: [
        { senderId    : user.id, recipientId  : currentUser.id },
        { recipientId : user.id, senderId     : currentUser.id }
      ],
      $sort: { createdAt: -1 },
      $limit: 10 
    };

    fetch(`${API}/messages?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(messages => this.setState({ messages }))
    .catch(err => console.log('ERR:', err))
    .done();
  }

  createMessage() {
    let { currentUser, user } = this.props;

    fetch(`${API}/messages`, {
      method: 'POST',
      headers: Headers,
      body: JSON.stringify({
        senderId: currentUser.id,
        recipientId: user.id,
        text: this.state.message,
        createdAt: new Date().valueOf(),
      })
    })
    .then(response => response.json())
    .then(data => this.setState({ message: '', messages: [data, ...this.state.messages]}))
    .catch(err => {})
    .done();
  }

  goBack() {
    this.props.navigator.pop();
  }

  render() {
    let { currentUser, user } = this.props;
    let titleConfig = {
      title: `${user.firstName} ${user.lastName}`,
      tintColor: 'white'
    };

    return(
      <View style={globals.flexContainer}>
        <InvertibleScrollView inverted={true}>
          {this.state.messages.map((msg, idx) => {
            let otherUser = isEqual(msg.senderId, currentUser.id) ? currentUser : user;
            return (
              <Message
                key={idx}
                message={msg}
                user={otherUser}
              />
            );
          })}
        </InvertibleScrollView>
        <View style={styles.navContainer}>
          <NavigationBar
            tintColor={Colors.brandPrimary}
            title={titleConfig}
            leftButton={<BackButton handlePress={this.goBack}/>}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            multiline={true}
            value={this.state.message}
            placeholder='Say something...'
            placeholderTextColor={Colors.bodyTextLight}
            onChangeText={(message) => this.setState({ message })}
            style={styles.input}
          />
          <TouchableOpacity
            style={ this.state.message ? styles.buttonActive : styles.buttonInactive }
            underlayColor='#D97573'
            onPress={this.createMessage}>
            <Text style={ this.state.message ? styles.submitButtonText : styles.inactiveButtonText }>Send</Text>
          </TouchableOpacity>
        </View>
        <KeyboardSpacer topSpacing={-50} />
      </View>
    )
  }
};

export default Conversation;