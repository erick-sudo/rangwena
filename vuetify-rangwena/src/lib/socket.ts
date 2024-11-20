import { io } from "socket.io-client";
import { apiHost } from "./apis";

const socket = io(apiHost);

export default socket;
