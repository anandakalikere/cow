import { useState, useEffect, useRef } from 'react';
import { FiSend, FiPhone, FiMoreVertical } from 'react-icons/fi';

export default function Chat({ user }) {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      lastMessage: 'Is this cow still available?',
      avatar: '👨‍🌾',
      unread: 2,
      timestamp: '2 min ago',
    },
    {
      id: 2,
      name: 'Priya Singh',
      lastMessage: 'I am interested in your Gir cow',
      avatar: '👩‍🌾',
      unread: 0,
      timestamp: '1 hour ago',
    },
  ]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedChat) {
      // Load mock messages for selected chat
      const mockMessages = [
        {
          id: 1,
          sender: 'other',
          text: 'Hi, what is the good condition of your cow?',
          timestamp: '10:30 AM',
        },
        {
          id: 2,
          sender: 'user',
          text: 'Health: Good, Age: 3 years, Milk: 15L/day',
          timestamp: '10:32 AM',
        },
        {
          id: 3,
          sender: 'other',
          text: 'Is this cow still available?',
          timestamp: '10:35 AM',
        },
        {
          id: 4,
          sender: 'user',
          text: 'Yes! Available. Price is ₹50,000',
          timestamp: '10:36 AM',
        },
      ];
      setMessages(mockMessages);
    }
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: messageInput,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageInput('');

    // Simulate reply
    setTimeout(() => {
      const reply = {
        id: messages.length + 2,
        sender: 'other',
        text: 'Thanks for your message! I will get back to you soon.',
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1000);
  };

  if (!user) {
    return (
      <div className="px-4 py-6 flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Please login to chat</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-100">
      {/* Chat List View */}
      {!selectedChat && (
        <div className="flex-1 overflow-y-auto pb-20">
          <div className="px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Messages</h1>

            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation)}
                  className="bg-white rounded-lg p-3 mb-2 cursor-pointer hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-3xl">{conversation.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {conversation.name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                      {conversation.unread > 0 && (
                        <div className="bg-green-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mt-1">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No conversations yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat View */}
      {selectedChat && (
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between z-10">
            <div
              className="flex items-center gap-3 cursor-pointer flex-1"
              onClick={() => setSelectedChat(null)}
            >
              <div className="text-2xl">{selectedChat.avatar}</div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold truncate">{selectedChat.name}</h2>
                <p className="text-xs text-green-100">Online</p>
              </div>
            </div>
            <button className="p-2 hover:bg-green-700 rounded-lg transition">
              <FiPhone size={20} />
            </button>
            <button className="p-2 hover:bg-green-700 rounded-lg transition">
              <FiMoreVertical size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-gray-300 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 px-4 py-3 flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              onClick={handleSendMessage}
              className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition flex-shrink-0"
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
