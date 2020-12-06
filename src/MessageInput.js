import React from 'react';
import SocketContext from './SocketContext';

class MessageInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {inputValues: {}};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const socket = this.context;
    let selected = this.props.selected;
    let input = event.target.children[0];
    let message = {
      recipient: this.props.selected,
      text: input.value,
    };

    if (message.text !== '') {
      socket.emit('chat message', message);
      let inputValues = this.state.inputValues;
      inputValues[selected] = '';
      this.setState({inputValues: inputValues});
    }
  }

  handleChange(event) {
    let selected = this.props.selected;
    let inputValues = this.state.inputValues;
    inputValues[selected] = event.target.value;
    this.setState({inputValues: inputValues});

    const socket = this.context;
    let payload = {chat: selected};
    socket.emit('typing', payload);
  }

  render() {
    let selected = this.props.selected;
    let value = this.state.inputValues[selected] || '';

    return (
      <form onSubmit={this.handleSubmit}>
        <input id="message-input" autoComplete="off" value={value} onChange={this.handleChange} />
        <button id="send-btn">Send</button>
      </form>
    );
  }
}
MessageInput.contextType = SocketContext;

export default MessageInput;