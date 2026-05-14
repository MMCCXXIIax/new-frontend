import { io, Socket } from 'socket.io-client';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://tx-predictive-intelligence.onrender.com';

export const socket: Socket = io(backendUrl, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  timeout: 20000,
  autoConnect: false,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export default socket;