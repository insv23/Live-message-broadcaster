interface Message {
  id: number;
  text: string;
}

class MessageManager {
  private messages: Message[] = [
    {id: 1, text: 'Hello, Astro!'},
    {id: 2, text: 'How are you?'},
  ];

  getAllMessages(): Message[] {
    return this.messages;
  }

  addMessage(text: string): Message {
    const newMessage: Message = {
      id: this.messages.length + 1,
      text
    };
    this.messages.push(newMessage);
    return newMessage;
  }
}

export const messageManager = new MessageManager();