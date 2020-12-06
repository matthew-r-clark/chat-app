import React from 'react';
import SocketContext from './SocketContext';

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      badges: {}
    };
    this.selectChat = this.selectChat.bind(this);
  }

  componentDidMount() {
    const socket = this.context;

    socket.on('update badges', message => {
      let sender = message.sender;
      let recipient = message.recipient;
      let selected = this.props.selected;
      let username = this.props.username;

      let conversation;
      if (recipient === 'General') {
        conversation = recipient;
      } else if (sender !== username) {
        conversation = sender;
      }

      if (conversation && conversation !== selected) {
        let badges = this.state.badges;
        if (badges[conversation]) {
          badges[conversation] += 1;
        } else {
          badges[conversation] = 1;
        }
        this.setState({badges: badges});
      }
    });
  }

  componentWillUnmount() {
    const socket = this.context;
    socket.off('update badges');
  }

  selectChat(event) {
    event.preventDefault();
    
    let username = event.currentTarget.getAttribute('data-username');
    let badges = this.state.badges;
    delete badges[username];
    this.setState({badges: badges});

    let input = document.getElementById('message-input');
    input.focus();
  }

  render() {
    let users = this.props.users;
    let selected = this.props.selected;
    let badges = this.state.badges;

    return (
      <div id="online">
        <h2>Chats:</h2>
        <ul id="users">
          <li key="general"
              data-username="General"
              onClick={event => {
                this.selectChat(event);
                this.props.setChat(event);
              }}
              className={selected === 'General' ? 'selected' : ''}
          >
            <div>General</div>
            <div className="badge">{badges['General']}</div>
          </li>
          {users.map(u => {
            return (
              <li key={u.id}
                  data-username={u.username}
                  onClick={event => {
                    this.selectChat(event);
                    this.props.setChat(event);
                  }}
                  className={u.username === selected ? 'selected' : ''}
              >
                <div>{u.username}</div>
                <div className="badge">{badges[u.username]}</div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
UserList.contextType = SocketContext;

export default UserList;