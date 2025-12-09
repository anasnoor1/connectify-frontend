import { io } from "socket.io-client";
import { getToken } from "./utills/checkToken";

export const socket = io("http://localhost:5000", {
  autoConnect: false,
});

export const connectSocket = () => {
  const token = getToken();
  if (!token) return;

  socket.auth = { token };

  if (!socket.connected) {
    socket.connect();
  }
};

