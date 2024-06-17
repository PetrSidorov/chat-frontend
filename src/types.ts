import { AxiosResponse } from "axios";
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
// {
//   "messages": [
//       {
//           "uuid": "90cd86ed-aa9f-485d-961d-43e0152eddf3",
//           "content": "12",
//           "sender": {
//               "username": "Peter",
//               "id": "04c6f17d-9380-4e87-b317-1582631b3084"
//           }
//       },
//   ],
//   "currentPage": 1,
//   "totalPages": 6,
//   "totalItems": 61
// }

export type TMessage = {
  uuid: string;
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

export type TConvo = {
  id: string;
  messages: TMessage[];
  participants: TUser[];
};

export type PaginatedResponse<T> = {
  data: T;
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export type GetConvosResponse = AxiosResponse<PaginatedResponse<TConvo[]>>;
export type GetMessagesResponse = PaginatedResponse<TMessage[]>;
// export type GetMessagesResponse = PaginatedResponse<TMessage[]>;

export type TOnlineStatuses = {
  [convoId: string]: string[];
};

export interface AxiosResponse<T = any> {
  config: {
    transitional?: any;
    adapter?: any[];
    transformRequest?: any[];
    transformResponse?: any[];
    timeout?: number;
    [key: string]: any;
  };
  data: T;
  headers: {
    "content-length"?: string;
    "content-type"?: string;
    [key: string]: any;
  };
  request: XMLHttpRequest;
  status: number;
  statusText: string;
}

export type TConvoContext = {
  convoContext: {
    // convos: TConvos | null;
    // unshiftMessagesToConvo: Function;
    // pushNewMessageToConvo: Function;
    // pushNewMessagesToConvo: (convoId: string, messages: TMessage[]) => void;
    // handleRemoveMessage: Function;
    // initConvo: Function;
    // addNewConvo: Function;
    // setAnimationType: Function;
    // joinRoom: Function;
    // getParticipantOnlineStatus: () => void;
    // onlineStatuses: { [key: string]: string[] };
    // animationType: string;
    // editMessageMode: boolean;
    // messageEdited: {
    //   userId: string;
    //   messageId: string;
    //   content: string;
    // };
  };
  activeConvoId: [string, Function];
  // socketPoll: [string[] | null, Dispatch<SetStateAction<string[] | null>>];
  removeConvo: (convoId: string) => void;
} | null;

type TypeHttpHeaders = Record<string, string>;

export type TPage<TData> = {
  messages: TData[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

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
