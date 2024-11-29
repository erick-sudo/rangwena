import { io } from "socket.io-client";
import { apiHost } from "./apis";

const socket = io(apiHost, {
  withCredentials: true,
});

export default socket;
