import React from 'react';
import SocketContext from './SocketContext';

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const socket = this.context;

    socket.on('chat message', message => {
      let username = this.props.username;
      let sender = message.sender;
      let recipient = message.recipient;
      let date = getDate();
      let listItem = <li key={genId()}>{date} - <span className="sender">{sender}</span>: {message.text}</li>;

      let conversation;
      if (sender === username || recipient === 'General') {
        conversation = recipient;
      } else {
        conversation = sender;
      }

      let messages = this.state[conversation] || [];
      messages.push(listItem);
      this.setState({[conversation]: messages});

      scrollToBottomOfElement(document.getElementById('messages'));
    });

    socket.on('user status', status => {
      let sender = status.sender;
      let listItem = <li key={genId()} className="status">{status.message}</li>

      let messages = this.state[sender] || [];
      messages.push(listItem);
      let generalMessages = this.state.General || [];
      generalMessages.push(listItem);
      this.setState({
        [sender]: messages,
        General: generalMessages
      });

      scrollToBottomOfElement(document.getElementById('messages'));
    });
  }

  componentWillUnmount() {
    const socket = this.context;
    socket.off('chat message');
    socket.off('user status');
  }

  render() {
    let messages = this.state[this.props.selected];

    return (
      <ul id="messages">
        {messages}
      </ul>
    );
  }
}
MessageList.contextType = SocketContext;

export default MessageList;

function scrollToBottomOfElement(element) {
  if (element) {
    element.scrollTo(0, element.scrollHeight);
  }
}

let genId = (function() {
  let count = 0;
  
  return function() {
    count += 1;
    return count;
  }
})();

function getDate() {
  let afternoon = false;
  let date = new Date();
  let hours = date.getHours();
  if (hours > 12) {
    hours -= 12;
    afternoon = true;
  } else if (hours === 0) {
    hours += 12;
  }
  let minutes = date.getMinutes();

  return `${p(hours)}:${p(minutes)}${afternoon ? 'pm' : 'am'}`;
}

function p(number) {
  number = String(number);
  return number.padStart(2, '0');
} 