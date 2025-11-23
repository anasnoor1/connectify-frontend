import { io } from "socket.io-client";
// export const socket = io("http://localhost:5000");

import { getToken } from "./utills/checkToken";

const token = getToken();
export const socket = io("http://localhost:5000", {
  auth: { token }
});

