import { QueueData, Splitbee, SplitbeeOptions } from './types';

const SCRIPT_URL = 'https://cdn.splitbee.io/sb.js';

const handleLoad = () => {
  splitbee.track = window.splitbee.track;
  splitbee.user = window.splitbee.user;
  splitbee.enableCookie = window.splitbee.enableCookie;

  queue.forEach(ev => {
    if (ev.type === 'event') window.splitbee.track.apply(null, ev.payload);
    else if (ev.type === 'user')
      window.splitbee.user.set.apply(null, ev.payload);
    else if (ev.type === 'enableCookie') window.splitbee.enableCookie();
  });
};

const queue: Array<QueueData> = [];
const createAddToQueue = (type: QueueData['type']) => (...args: any) => {
  queue.push({ type: type, payload: args });
  if (window.splitbee) {
    handleLoad();
  }
};

const initSplitbee = (options?: SplitbeeOptions) => {
  if (typeof window === 'undefined' || window.splitbee) return;

  const script = document.createElement('script');
  script.src = options?.scriptUrl ? options.scriptUrl : SCRIPT_URL;
  script.async = true;

  if (options) {
    if (options.apiUrl) script.dataset.api = options.apiUrl;
    if (options.token) script.dataset.token = options.token;
    if (options.disableCookie) script.dataset.noCookie = '1';
  }

  script.onload = handleLoad;
  document.head.appendChild(script);
};

const splitbee: Splitbee = window.splitbee || {
  track: createAddToQueue('event'),
  user: {
    set: createAddToQueue('user'),
  },
  init: initSplitbee,
  enableCookie: createAddToQueue('enableCookie'),
};

export default splitbee;
