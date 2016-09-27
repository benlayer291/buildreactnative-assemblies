'use strict';

import React, { Component } from 'react';
import { Navigator } from 'react-native';

import { flatten, uniq } from 'underscore';

import { DEV, API } from '../../config';

import Conversation from './Conversation';
import Conversations from './Conversations';

import { globals } from '../../styles';


class MessagesView extends Component{
  constructor() {
    super();
    this.state = {
      conversations: [],
      ready: false,
      users: [],
    };
  }

  componentDidMount() {
    this._loadConversations();
  }

  _loadUsers(conversations) {
    let userIds = uniq(flatten(conversations.map(c => [c.user1Id, c.user2Id])));
    let query = { id: { $in: userIds }};

    fetch(`${API}/users/?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(users => this.setState( {conversations, users, ready: true }))
    .catch(err => this.ready(err))
    .done();
  }

  _loadConversations() {
    console.log(this.props);
    let { currentUser } = this.props;
    let query = {
      $or: [
        { user1Id: currentUser.id },
        { user2Id: currentUser.id }
      ],
      $limit: 10, 
      $sort: { lastMessageDate: -1 }
    };

    fetch(`${API}/conversations?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(conversations => this._loadUsers(conversations))
    .catch(err => this.ready(err))
    .done();
  }

  ready(err) {
    this.setState({ ready: true });
  }

  render(){
    let titleConfig = { title: 'Messages', tintColor: 'white' };
    return (
      <Navigator
        style={globals.flex}
        initialRoute={{ name: 'Conversations' }}
        renderScene={(route, navigator) => {
          switch(route.name){
            case 'Conversations':
              return (
                <Conversations
                  {...this.props}
                  {...this.state}
                  navigator={navigator}
                />
            );
            case 'Conversation':
              return (
                <Conversation
                  {...this.props}
                  {...this.state}
                  {...route}
                  navigator={navigator}
                />
            );
          }
        }}
      />
    );
  }
}

export default MessagesView;