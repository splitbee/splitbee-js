# splitbee-node

Used to track events for Splitbee using Node.JS

### Basic Usage

```js
const { SplitbeeAnalytics } = require('@splitbee/node');

// Token can be found in dashboard settings
const analytics = new SplitbeeAnalytics('PROJECT_TOKEN');

analytics.track({
  userId: 'myunique@user.id',
  event: 'Payment confirmed',
  data: {
    paymentId: '1234567890',
  },
});
```

Set data to user profile

```js
analytics.user.set({
  userId: 'myunique@user.id',
  userData: {
    username: 'Custom Name',
    isTrial: true,
  },
});
```

The full reference can be found in our [documentation](https://splitbee.io/docs/backend-analytics-nodejs).
