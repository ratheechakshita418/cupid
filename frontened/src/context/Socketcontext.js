import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user) return;
    const s = io('http://localhost:5000', { withCredentials: true });
    s.emit('user_online', user._id);
    s.on('user_online', (userId) => {
      setOnlineUsers(prev => [...prev.filter(id => id !== userId), userId]);
    });
    s.on('user_offline', (userId) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    });
    setSocket(s);
    return () => s.disconnect();
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
