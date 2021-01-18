type QueueData = {
  type: 'user' | 'event';
  payload: any;
};

const start = (
  win: Window & typeof globalThis,
  doc: Document,
  name: any,
  src: string
) => {
  if (window.splitbee) return;
  const queue: Array<QueueData> = [];
  function addToQueue(type: QueueData['type']) {
    return function() {
      queue.push({ type: type, payload: arguments });
    };
  }
  win[name] = win[name] || {
    track: addToQueue('event'),
    user: {
      set: addToQueue('user'),
    },
  };

  const script = doc.createElement('script');
  script.src = src;
  script.async = true;
  script.onload = function() {
    queue.forEach(ev => {
      if (ev.type === 'event') window.splitbee.track.apply(null, ev.payload);
      if (ev.type === 'user') window.splitbee.user.set.apply(null, ev.payload);
    });
  };
  doc.head.appendChild(script);
};

start(window, document, 'splitbee', 'https://cdn.splitbee.io/sb.js');

export default () => {
  return window.splitbee;
};
