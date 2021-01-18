import { Splitbee } from './types';

const SCRIPT_URL = 'https://cdn.splitbee.io/sb.js';

type SplitbeeOptions = {
  disableCookie?: boolean;
  token?: string;
  api?: string;
};

const queue: Array<QueueData> = [];
const createAddToQueue = (type: QueueData['type']) => {
  return (...args: any) => {
    queue.push({ type: type, payload: args });
  };
};

let splitbee: Splitbee = window.splitbee || {
  track: createAddToQueue('event'),
  user: {
    set: createAddToQueue('user'),
  },
};

export const init = (options?: SplitbeeOptions) => {
  if (typeof window === 'undefined' || window.splitbee) return;

  const script = document.createElement('script');
  script.src = SCRIPT_URL;
  script.async = true;

  if (options) {
    if (options.api) script.dataset.api = options.api;
    if (options.token) script.dataset.token = options.token;
    if (options.disableCookie) script.dataset.noCookie = '1';
  }

  script.onload = function() {
    splitbee = window.splitbee;
    queue.forEach(ev => {
      if (ev.type === 'event') window.splitbee.track.apply(null, ev.payload);
      if (ev.type === 'user') window.splitbee.user.set.apply(null, ev.payload);
    });
  };
  document.head.appendChild(script);
};

export default splitbee;

type QueueData = {
  type: 'user' | 'event';
  payload: any;
};
