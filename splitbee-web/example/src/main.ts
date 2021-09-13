import './style.css';
import splitbee from '@splitbee/web';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const deleteAllCookies = () => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

const run = async () => {
  deleteAllCookies();
  console.log('Preload: ', document.cookie);
  splitbee.init({
    disableCookie: true,
    token: 'NCOSXDG3NWJC',
    scriptUrl: 'https://deploy-preview-42--splitbee.netlify.app/sb.js',
    apiUrl: 'https://hive.splitbee.io',
  });

  await sleep(1000);
  console.log('Loaded: ', document.cookie);
  splitbee.track('No Cookie');
  await sleep(1000);
  splitbee.enableCookie(true);
  console.log('Enable Cookie', document.cookie);
  splitbee.track('New Cookie Reset');
  await sleep(1000);
  splitbee.reset();
  console.log('Reset Cookie', document.cookie);
  splitbee.track('Reset Cookie');
  await sleep(1000);
};

const app = document.querySelector<HTMLDivElement>('#app')!;

(window as any).run = run;

app.innerHTML = `
  <h1>Hello Splitbee!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`;
