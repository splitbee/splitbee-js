export {};

type Data = { [key: string]: string | number | boolean };

export type Splitbee = {
  track: (event: string, data?: Data) => Promise<void>;
  user: {
    set: (data: Data) => Promise<void>;
  };
};

declare global {
  interface Window {
    splitbee: Splitbee;
  }
}
