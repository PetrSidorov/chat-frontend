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

export type GetConvosResponse = PaginatedResponse<TConvo[]>;
export type GetMessagesResponse = PaginatedResponse<TMessage[]>;

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

type TypeHttpHeaders = Record<string, string>;

export type TDataKey = "messages" | "convos";
export type TMessageToSend = Omit<TMessage, "createdAt">;

type TdataRecord<TData> = Record<TDataKey, TData[]>;
export type TUserInteraction = TMessage | TConvo | TMessageToSend;

// #ask-artem any less lengthy ways to do this?
export type TPage<TData> = TdataRecord<TData> & {
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
