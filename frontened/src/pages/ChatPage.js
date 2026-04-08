import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export default function ChatPage() {
  const { userId } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`/api/messages/${userId}`);
        setMessages(data);
      } catch (err) {
        console.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [userId]);

  useEffect(() => {
    if (!socket) return;
    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on('message_sent', (msg) => {
      setMessages((prev) => [...prev, { ...msg, senderId: user._id }]);
    });
    socket.on('typing_start', (senderId) => {
      if (senderId === userId) setIsTyping(true);
    });
    socket.on('typing_stop', (senderId) => {
      if (senderId === userId) setIsTyping(false);
    });
    return () => {
      socket.off('receive_message');
      socket.off('message_sent');
      socket.off('typing_start');
      socket.off('typing_stop');
    };
  }, [socket, user, userId]);

  const handleSend = () => {
    if (!input.trim() || !userId || !socket) return;
    socket.emit('send_message', { recipientId: userId, content: input });
    setInput('');
  };

  if (!userId) {
    return <div style={{ textAlign: 'center', padding: 40 }}>Select a match to start chatting</div>;
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px', height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 20, borderRadius: 12, background: '#f9fafb', padding: 16 }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: 12,
              textAlign: msg.senderId === user?._id ? 'right' : 'left',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                background: msg.senderId === user?._id ? '#e91e8c' : '#e5e7eb',
                color: msg.senderId === user?._id ? 'white' : '#1a0a2e',
                padding: '10px 16px',
                borderRadius: 12,
                maxWidth: '70%',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ textAlign: 'left', marginBottom: 12 }}>
            <div
              style={{
                display: 'inline-block',
                background: '#e5e7eb',
                color: '#1a0a2e',
                padding: '10px 16px',
                borderRadius: 12,
              }}
            >
              Typing...
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="input-field"
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (socket && e.target.value.trim()) {
              socket.emit('typing_start', userId);
            } else if (socket) {
              socket.emit('typing_stop', userId);
            }
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          style={{ flex: 1 }}
        />
        <button className="btn-primary" onClick={handleSend} style={{ padding: '12px 20px' }}>
          Send
        </button>
      </div>
    </div>
  );
}
