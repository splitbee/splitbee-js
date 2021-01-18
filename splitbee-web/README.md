# @splitbee/web

Used to track page views and events using any web framework like Next.js, Gatsby.js, Nuxt.js and others

### Usage

```js
import { init } from '@splitbee/web';

init();
```

There are possible parameters that you can use to configure Splitbee.

```js
init({
  noCookie: true, // will disable the cookie usage
});
```
