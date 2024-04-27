import { io } from "socket.io-client";
const URL = "http://localhost:3007";

export const socket = io(URL, { withCredentials: true });
// TODO:BUGFIX this connection happens automatically, but it looks
// like there's a connection issue if you are just logged in
// i think this is the reason behind statuses issue - there's just no websocket connection
