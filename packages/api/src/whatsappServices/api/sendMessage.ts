

type SendMessageProps = {
  url: string;
  phone: string;
  message: string;
}
export const sendMessageSync = ({ message, phone, url, }: SendMessageProps) => fetch(`${url}/message/${phone}/send`, {
  method: "POST",
  //pass the message to the body
  body: JSON.stringify({
    message: message
  }),
  headers: {
    "Content-Type": "application/json"
  }
});

export const sendMessageQueue = ({ message, phone, url, }: SendMessageProps) => fetch(`${url}/queue/${phone}/send-message`, {
  method: "POST",
  //pass the message to the body
  body: JSON.stringify({
    message: message
  }),
  headers: {
    "Content-Type": "application/json"
  }
});


