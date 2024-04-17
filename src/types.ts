import { SetStateAction, Dispatch } from "react";

export type TLoginDataBaseResponse = {
  token: string;
  user: TUser;
};
export type TUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string | null;
};
// loading, user, isLoaded, data, error, setUser
// export type TAuthContext = {
//   // TUser | null,
//   // Dispatch<SetStateAction<TUser | null>>
//   loading: boolean;
//   user: TUser | null;
//   isLoaded: boolean;
//   data: any;
//   error: any;
//   setUser: Dispatch<SetStateAction<TUser | null>>;
// };

export type TMessage = {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    username: string;
    id: string;
  };
};

export type PixelCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TMessageForSending = TMessage & {
  convoId: string;
};

// export type Tactors = {
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

export type TConvos = {
  [convoId: string]: {
    messages: TMessage[];
    participants: TUser[];
  };
};

export type ConvoProps = {
  data: TConvos;
};

export type TOnlineStatuses = {
  [convoId: string]: string[];
};

export type TConvoContext = {
  convoContext: {
    convos: TConvos;
    unshiftMessagesToConvo: Function;
    pushNewMessageToConvo: Function;
    pushNewMessagesToConvo: (...args: unknown[]) => void;
    handleRemoveMessage: Function;
    initConvo: Function;
    getParticipantOnlineStatus: () => void;
    onlineStatuses: { [key: string]: string[] };
  };
  activeConvoId: [string, Function];
  socketPoll: [string[] | null, Dispatch<SetStateAction<string[] | null>>];
  removeConvo: (convoId: string) => void;
};

type TypeHttpHeaders = Record<string, string>;

export type TDataBaseRequestData = {
  method: string;
  url: string;
  body?: Object | string;
  serialize?: Function;
  headers?: TypeHttpHeaders;
};

export type TCSSclampLines = React.CSSProperties & {
  WebkitBoxOrient: string;
  WebkitLineClamp: number;
};
