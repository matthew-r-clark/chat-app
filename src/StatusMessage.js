function StatusMessage(props) {
  let message = props.message;
  let id = props.id;

  return (
    <li key={id} className="status">{message}</li>
  );
}

export default StatusMessage;