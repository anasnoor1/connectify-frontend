import { io } from "socket.io-client";
import { getToken } from "./utills/checkToken";

export const socket = io("http://localhost:5000", {
  autoConnect: false,
});

let lastToken = null;

const ensureListenerInstalled = () => {
  if (typeof window === "undefined") return;
  if (window.__connectifySocketAuthListenerInstalled) return;
  window.__connectifySocketAuthListenerInstalled = true;
  window.addEventListener("auth-token-changed", () => {
    connectSocket();
  });
};

ensureListenerInstalled();

export const connectSocket = () => {
  const token = getToken();
  if (!token) {
    lastToken = null;
    if (socket.connected) socket.disconnect();
    return;
  }

  socket.auth = { token };

  // If user changed (token changed), force reconnect so server attaches correct socket.user
  if (socket.connected && lastToken && lastToken !== token) {
    socket.disconnect();
  }

  lastToken = token;

  if (!socket.connected) socket.connect();
};

