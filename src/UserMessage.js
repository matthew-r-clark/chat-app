function UserMessage(props) {
  let time = getTime();
  let sender = props.message.sender;
  let message = props.message.text;
  let key = props.id;

  return (
    <li key={key}>
      {time} - <span className="sender">{sender}</span>: {message}
    </li>
  );
}

export default UserMessage;

function getTime() {
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