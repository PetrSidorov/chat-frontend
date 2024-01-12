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

export type TMessage = {
  content: string;
  convoId: string;
  createdAt: string;
  sender: { username: string };
};

export type TActiveConvoContextValue = {
  id: string;
  messages: TMessage[];
  offset: number;
};

export type TActiveConvoContext = [
  TActiveConvoContextValue | null,
  Dispatch<SetStateAction<TActiveConvoContextValue | null>>
];
