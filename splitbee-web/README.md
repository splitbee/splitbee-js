# splitbee-node

Used to track events for Splitbee using Node.JS

### Usage

```js
import { SplitbeeAnalytics } from '@splitbee/node';

const analytics = new SplitbeeAnalytics('PROJECT_ID');

analytics.track({
  userId: 'myunique@user.id',
  event: 'Payment confirmed',
  data: {
    paymentId: '1234567890',
  },
});
```
