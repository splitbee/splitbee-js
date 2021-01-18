export {};

type Data = { [key: string]: string | number | boolean };

export type SplitbeeOptions = {
  disableCookie?: boolean;
  token?: string;
  api?: string;
  src?: string;
};

export type Splitbee = {
  track: (event: string, data?: Data) => Promise<void>;
  user: {
    set: (data: Data) => Promise<void>;
  };
  init: (config?: SplitbeeOptions) => void;
  enableCookie: () => void;
};

declare global {
  interface Window {
    splitbee: Splitbee;
  }
}

export type QueueData = {
  type: 'user' | 'event' | 'enableCookie';
  payload: any;
};
