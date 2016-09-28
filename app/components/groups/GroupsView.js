'use strict';

import React, { Component } from 'react';
import { 
  Navigator
} from 'react-native';

import { find, isEqual } from 'underscore';

import Headers from '../../fixtures';
import { API, DEV } from '../../config';

import Groups from './Groups';
import CreateGroup from './CreateGroup';
import CreateGroupConfirmation from './CreateGroupConfirmation';
import Group from './Group';

import { globals } from '../../styles';

class GroupsView extends Component{
  constructor() {
    super();
    this.addGroup = this.addGroup.bind(this);
    this.addUserToGroup = this.addUserToGroup.bind(this);
    this.unsubscribeFromGroup = this.unsubscribeFromGroup.bind(this);
    this.state ={
      groups: [],
      ready: false,
      suggestedGroups: [],
    }
  }

  addGroup(group) {
    this.setState({
      groups: [
        ...this.state.groups, group
      ]
    });
  }

  addUserToGroup(group, currentUser) {
    let { groups, suggestedGroups } = this.state;
    let member = {
      userId    : currentUser.id,
      role      : 'member',
      joinedAt  : new Date().valueOf(),
      confirmed : true
    };
    if (! find(group.members, ({ userId}) => isEqual(userId, currentUser.id))){
      group.members = [ ...group.members, member ];
      groups = [ ...groups, group ];
      suggestedGroups = suggestedGroups.filter(({ id }) => ! isEqual(id, group.id));

      this.setState({ groups, suggestedGroups })
      this.updateGroup(group);
    }
  }

  unsubscribeFromGroup(group, currentUser) {
    let { groups, suggestedGroups } = this.state;

    group.members = group.members.filter(({ userId }) => ! isEqual(userId, currentUser.id));
    groups = groups.filter(({ id }) => ! isEqual(id, group.id));
    suggestedGroups = [ ...suggestedGroups, group ];

    this.setState({ groups, suggestedGroups });
    this.updateGroup(group);
  }

  updateGroup(group) {
    fetch(`${API}/groups/${group.id}`, {
      method: 'PUT',
      headers: Headers,
      body: JSON.stringify(group)
    })
    .then(response => response.json())
    .then(data => {})
    .catch(err => {})
    .done();
  }

  componentWillMount() {
    this._loadGroups(this.props.currentUser);
  }

  _loadGroups(currentUser) {
    let query = {
      members: {$elemMatch: { userId: currentUser.id }},
      $limit: 10,
    };

    fetch(`${API}/groups/?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(groups => this._loadSuggestedGroups(groups))
    .catch(err => this.ready(err))
    .done();
  }

  _loadSuggestedGroups(groups) {
    this.setState({ groups, ready: true });
    let query = {
      // Query groups that the user does not belong to but are nearby
      id: {$nin: groups.map(group => group.id) },
      'location.city.long_name': this.props.currentUser.location.city.long_name,
      $limit: 4,
    };

    fetch(`${API}/groups/?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(suggestedGroups => this.setState({ suggestedGroups }))
    .catch(err => this.ready(err))
    .done();
  }

  ready(err) {
    this.setState({ ready: true });
  }

  render() {
    return (
      <Navigator
        style={globals.flex}
        initialRoute={{ name: 'Groups' }}
        renderScene={(route, navigator) => {
          switch(route.name){
            case 'Groups':
              return (
                <Groups
                  {...this.props}
                  {...this.state}
                  navigator={navigator}
                />
            );
            case 'CreateGroup':
              return (
                <CreateGroup
                  {...this.props}
                  {...this.state}
                  {...route}
                  navigator={navigator}
                />
            );
            case 'CreateGroupConfirmation':
              return (
                <CreateGroupConfirmation
                  {...this.props}
                  {...route}
                  navigator={navigator}
                  addGroup={this.addGroup}
                />
            );
            case 'Group':
              return (
                <Group
                  {...this.props}
                  {...route}
                  navigator={navigator}
                  addUserToGroup={this.addUserToGroup}
                  unsubscribeFromGroup={this.unsubscribeFromGroup}
                />
            );
          }
        }}
      />
    );
  }
};

export default GroupsView;