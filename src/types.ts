import { SetStateAction, Dispatch } from "react";

export type TUser = {
  name: string;
  username: string;
  email: string;
};

export type TAuthContext = [
  TUser | null,
  Dispatch<SetStateAction<TUser | null>>
];

export type MessageT = {
  content: string;
  convoId: string;
  createdAt: string;
  sender?: { username: string | "user" };
};
