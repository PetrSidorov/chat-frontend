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
  message?: string;
  onlineStatus?: boolean;
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

export type TMessageToSend = TMessage & {
  convoId: string;
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
    // actors: Tactors;
    // receiver: TUser;
    // onlineStatus: boolean;
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

export type TOnlineStatuses = {
  [convoId: string]: string[];
};

// const x: { [key: string]: unknown } = [];
// const y: {} = [];

// const user: { login: string } | Record<string, unknown> = {};
const user: Partial<{ login: string }> = {};

function isUser(user: Partial<{ login: string }>): user is { login: string } {
  return (
    Boolean(user) &&
    Object.keys(user).length > 0 &&
    "login" in user &&
    typeof user.login == "string"
  );
}

// const user2 = { login: "Bruce" ....}

if (isUser(user)) {
  user.login;
}

export type TConvoContext = {
  convoContext: {
    convos: TConvos | {};
    unshiftMessagesToConvo: Function;
    pushNewMessageToConvo: Function;
    pushNewMessagesToConvo: (...args: unknown[]) => void;
    handleRemoveMessage: Function;
    initConvo: Function;
    getParticipantOnlineStatus: () => void;
  };
  activeConvoId: [string, Function];
  socketPoll: [string[] | null, Dispatch<SetStateAction<string[] | null>>];
};

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
export type TCSSclampLines = React.CSSProperties & {
  WebkitBoxOrient?: string;
  WebkitLineClamp?: number;
};
