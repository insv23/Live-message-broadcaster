import React from 'react';

interface Message {
  id: string;
  text: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({messages}) => {
  return (
    <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
    </ul>
  );
};

export default MessageList;
