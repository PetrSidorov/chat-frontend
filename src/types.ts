import { SetStateAction, Dispatch } from "react";

export type TLoginDataBaseResponse = {
  token: string;
  user: TUser;
};
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

export type TConvos = { [key: string]: TMessage[] };

export type ConvoProps = {
  data: TConvos;
};

export type TConvoContext = {
  convoContext: [TConvos | null, Function];
  activeConvoId: [String | null, Dispatch<SetStateAction<string | null>>];
};

export enum TSidebarTabs {
  FRIENDS = "FRIENDS",
  SETTINGS = "SETTINGS",
  MESSAGES = "MESSAGES",
}

type TypeHttpHeaders = {
  [key: string]: string;
};
export type TDataBaseRequestData = {
  method: string;
  url: string;
  body?: Object | string;
  serialize?: Function;
  headers?: TypeHttpHeaders;
};
