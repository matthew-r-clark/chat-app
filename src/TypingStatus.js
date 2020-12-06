import React from 'react';
import SocketContext from './SocketContext';

class TypingStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {usersTyping: []};
  }

  componentDidMount() {
    const socket = this.context;
    let intervals = {};

    socket.on('users typing', data => {
      let usersTyping = this.state.usersTyping;
      let selected = this.props.selected;
      let chat = data.chat;
      let sender = data.sender;

      if (selected === chat && !usersTyping.includes(sender)) {
        usersTyping.push(sender);
      }

      this.setState({usersTyping: usersTyping});

      if (intervals[sender]) {
        clearInterval(intervals[sender]);
      }

      intervals[sender] = setTimeout(() => {
        usersTyping = this.state.usersTyping;
        let index = usersTyping.indexOf(sender);
        usersTyping.splice(index, 1);
        this.setState({usersTyping: usersTyping});
      }, 500);
    });
  }

  render() {
    let text = usersTypingText(this.state.usersTyping);

    return (
      <div id="typing">
        {text}
      </div>
    );
  }
}
TypingStatus.contextType = SocketContext;

export default TypingStatus;

function joinAnd(array, joiner) {
  let allButLast = array.slice(0, -1);
  let last = array.slice(-1)[0];
  return allButLast.join(joiner) + ' and ' + last;
}

function usersTypingText(users) {
  let text = '';

  if (users.length > 3) {
    text = 'Many people are typing...';
  } else if (users.length > 1) {
    text = joinAnd(users, ', ') + ' are typing...';
  } else if (users.length > 0) {
    text = users[0] + ' is typing...';
  }

  return text;
}