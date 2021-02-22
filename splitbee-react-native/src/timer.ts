let secondsActive = 0;

let interval: NodeJS.Timeout;

export const startInterval = () => {
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => {
    secondsActive += 1;
  }, 1000);
};

startInterval();

export const resetTime = () => {
  startInterval();
  secondsActive = 0;
};

export const getActiveSeconds = () => {
  return secondsActive;
};
