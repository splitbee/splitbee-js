# splitbee-node

Used to track events for Splitbee using Node.JS

### Usage

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
