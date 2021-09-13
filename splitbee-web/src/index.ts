import { QueueData, Splitbee, SplitbeeOptions } from './types';

const isBrowser = typeof window !== 'undefined';
const SCRIPT_URL = 'https://cdn.splitbee.io/sb.js';
let queue: Array<QueueData> = [];

const handleLoad = () => {
  if (isBrowser && !window.splitbee) return;
  splitbee.track = window.splitbee.track;
  splitbee.user = window.splitbee.user;
  splitbee.enableCookie = window.splitbee.enableCookie;
  splitbee.reset = window.splitbee.reset;

  queue.forEach(ev => {
    if (ev.type === 'track') window.splitbee.track.apply(null, ev.payload);
    else if (ev.type === 'user')
      window.splitbee.user.set.apply(null, ev.payload);
    else if (ev.type === 'enableCookie')
      window.splitbee.enableCookie.apply(null, ev.payload);
    else if (ev.type === 'reset') window.splitbee.reset();
  });

  queue = [];
};

const createAddToQueue = (type: QueueData['type']) => async (...args: any) => {
  queue.push({ type: type, payload: args });
  if (isBrowser && window.splitbee) {
    handleLoad();
  }
};

const initSplitbee = (options?: SplitbeeOptions) => {
  if (!isBrowser || window.splitbee) return;

  const document = window.document;
  const scriptUrl = options?.scriptUrl ? options.scriptUrl : SCRIPT_URL;

  const injectedScript = document.querySelector(
    `script[src='${scriptUrl}']`
  ) as HTMLScriptElement | null;

  if (injectedScript) {
    injectedScript.onload = handleLoad;
    return;
  }

  const script = document.createElement('script');
  script.src = scriptUrl;
  script.async = true;

  if (options) {
    if (options.apiUrl) script.dataset.api = options.apiUrl;
    if (options.token) script.dataset.token = options.token;
    if (options.disableCookie) script.dataset.noCookie = '1';
  }

  script.onload = handleLoad;

  document.head.appendChild(script);
};

const splitbee: Splitbee = {
  track: createAddToQueue('track'),
  user: {
    set: createAddToQueue('user'),
  },
  init: initSplitbee,
  enableCookie: createAddToQueue('enableCookie'),
  reset: createAddToQueue('reset'),
};

export default splitbee;
