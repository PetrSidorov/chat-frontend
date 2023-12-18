import { io } from "socket.io-client";
const URL = "http://localhost:3007";

export const socket = io(URL);
