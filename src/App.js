import React from "react";
import SocketContext from './SocketContext';
import UserList from './UserList';
import MessageList from './MessageList';
import TypingStatus from './TypingStatus';
import MessageInput from './MessageInput';
import socketIOClient from "socket.io-client";
const SERVER_ENDPOINT = process.env.SERVER_ENDPOINT;

const socket = socketIOClient(SERVER_ENDPOINT, {transports: ['websocket']});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      users: [],
      selected: 'General',
    };
  }

  componentDidMount() {
    socket.on('request username', () => {
      let name = prompt('Please enter your name:')
      this.setState({username: name});
      socket.emit('join chat', {username: name});
    });

    socket.on('invalid name', (message) => {
      let name = prompt(message)
      this.setState({username: name});
      socket.emit('join chat', {username: name});
    });

    socket.on('online', data => {
      let users = data.online.filter(u => u.username !== this.state.username);
      this.setState({users: users});
    });
  }

  setChat(event) {
    event.preventDefault();
    let username = event.currentTarget.getAttribute('data-username');
    this.setState({selected: username});
  }

  render() {
    let username = this.state.username;
    let users = this.state.users;
    let selected = this.state.selected;

    return (
      <SocketContext.Provider value={socket}>
        <div className="app">
          <UserList username={username} users={users} selected={selected} setChat={this.setChat.bind(this)}/>
          <MessageList username={username} selected={selected}/>
          <TypingStatus selected={selected}/>
          <MessageInput username={username} selected={selected}/>
        </div>
      </SocketContext.Provider>
    );
  }
}

export default App;