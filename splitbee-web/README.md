# @splitbee/web

Used to track page views and events using any web framework like Next.js, Gatsby.js, Nuxt.js and others

### Usage

```js
import splitbee from '@splitbee/web';

splitbee.init();
```

There are possible parameters that you can use to configure Splitbee.

```js
splitbee.init({
  disableCookie: true, // will disable the cookie usage
});
```

### Track events

```js
splitbee.track('My event', { some: 'data' });
```

### Set user data

```js
splitbee.user.set({ email: 'my@gmail.com' });
```
