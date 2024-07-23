import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import MessageList from './MessageList.tsx';
import TextBox from './TextBox.tsx';

interface Message {
  id: string;
  text: string;
}

const MessageBoard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('disconnected');

  const addMessage = useCallback((message: Message) => {
    setMessages((prevMessages) => {
      // Check if the message already exists (de-duplication)
      if (prevMessages.some((m) => m.id === message.id)) {
        return prevMessages;
      }
      return [...prevMessages, message];
    });
  }, []);

  useEffect(() => {
    let eventSource: EventSource;
    let retryCount = 0;
    const MAX_RETRIES = 5;

    // Initial load message
    fetch('/api/messages')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch messages');
        return res.json() as Promise<Message[]>;
      })
      .then((data: Message[]) => setMessages(data))
      .catch((error) =>
        console.error('Error fetching initial messages:', error),
      );

    // Set SSE
    function connect() {
      setConnectionStatus('connecting');
      eventSource = new EventSource('/api/sse');

      eventSource.onopen = () => {
        setConnectionStatus('connected');
        retryCount = 0; // Reset retry count on successful connection
      };

      eventSource.onmessage = (event) => {
        const message: Message = JSON.parse(event.data);
        addMessage(message);
      };

      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        setConnectionStatus('disconnected');
        eventSource.close();

        if (retryCount < MAX_RETRIES) {
          retryCount++;
          setTimeout(connect, 3000); // Reconnect after 3 seconds
        } else {
          console.log('Max retries reached. Giving Up.');
        }
      };
    }

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [addMessage]);

  const handleSaveText = async(text: string) => {
    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ text: text }),
      });
      if (!response.ok) {
        throw new Error('Failed to save message');
      }
    } catch (error) {
      console.error('Error saving message:', error);
      alert('Failed to save message.');
    }
  };

  return (
    <div>
      <p>Connection status: {connectionStatus}</p>
      <MessageList messages={messages} />
      <TextBox onSave={handleSaveText} />
    </div>
  );
};

export default MessageBoard;
