import { SetStateAction, Dispatch } from "react";

export type TLoginDataBaseResponse = {
  token: string;
  user: TUser;
};
export type TUser = {
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
};

export type TAuthContext = [
  TUser | null,
  Dispatch<SetStateAction<TUser | null>>
];

export type TMessage = {
  id: string;
  content: string;
  convoId: string;
  createdAt: string;
  sender: { username: string; id: string };
};

export type Tactors = {
  initiator: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  joiner: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
};

export type TConvos = {
  [key: string]: {
    messages: TMessage[];
    actors: Tactors;
    // actors: {
    //   initiator: {
    //     id: string;
    //     username: string;
    //     avatarUrl: string | null;
    //   };
    //   joiner: {
    //     id: string;
    //     username: string;
    //     avatarUrl: string | null;
    //   };
    // };
  };
};

export type ConvoProps = {
  data: TConvos;
};

export type TConvoContext = {
  convoContext: {
    convos: TConvos | null;
    unshiftMessagesToConvo: Function;
    pushNewMessageToConvo: Function;
    pushNewMessagesToConvo: Function;
    initConvo: Function;
  };
  activeConvoId: [string | null, Function];
  socketPoll: [string[] | null, Dispatch<SetStateAction<string[] | null>>];
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

// export TNavigationContext = {[string | null, Dispatch<SetStateAction<string | null>>]}
