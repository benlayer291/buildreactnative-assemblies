'use strict';

import React, { Component } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ListView 
} from 'react-native';

import { find, isEqual } from 'underscore';

import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';

import Loading from '../shared/Loading';

import { rowHasChanged } from '../../utilities';

import Colors from '../../styles/colors';
import { globals, messagesStyles } from '../../styles';

const styles = messagesStyles;

class Conversations extends Component{
  constructor() {
    super();
    this._renderRow = this._renderRow.bind(this);
    this.dataSource = this.dataSource.bind(this);
    this.visitConversation = this.visitConversation.bind(this);
  }

  visitConversation(user) {
    this.props.navigator.push({
      name: 'Conversation',
      user,
    });
  }

  _renderRow(conversation) {
    let { currentUser } = this.props;
    let userIDs = [ conversation.user1Id, conversation.user2Id];
    let otherUserID = find(userIDs, (id) => !isEqual(id, currentUser.id));
    let user = find(this.props.users, ({ id }) => isEqual(id, otherUserID));

    return (
      <TouchableOpacity 
        style={globals.flexContainer}
        onPress={() => this.visitConversation(user)}>
        <View style={globals.flexRow}>
          <Image 
            style={globals.avatar} 
            source={{uri: user.avatar}}
          />
          <View style={globals.flex}>
            <View style={globals.textContainer}>
              <Text style={styles.h5}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.h6}>
                {moment(conversation.lastMessageDate).fromNow()}
              </Text>
            </View>
            <Text style={styles.h4}>
              {conversation.lastMessageText.substring(0, 40)}...
            </Text>
          </View>
          <View style={styles.arrowContainer}>
            <Icon 
              size={30} 
              name="ios-arrow-forward" 
              color={Colors.bodyTextLight}
            />
          </View>
        </View>
        <View style={styles.divider}/>
      </TouchableOpacity>
    );
  }

  dataSource() {
    return (
      new ListView.DataSource({ rowHasChanged: rowHasChanged })
      .cloneWithRows(this.props.conversations)
    );
  }

  render() {
    if (!this.props.ready) { return <Loading /> }

    let titleConfig = { title: 'Messages', tintColor: 'white' };
  
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          title={titleConfig}
          tintColor={Colors.brandPrimary}
        />
        <ListView
          enableEmptySections={true}
          dataSource={this.dataSource()}
          contentInset={{ bottom: 49 }}
          renderRow={this._renderRow}
        />
      </View>
    )
  }
}

export default Conversations;