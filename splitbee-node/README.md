# splitbee-node

Used to track events for Splitbee using Node.JS

### Usage

```js
import { Analytics } from '@splitbee/node';

const analytics = new Analytics('PROJECT_ID');

analytics.track({
  userId: 'myunique@user.id',
  event: 'Payment confirmed',
  data: {
    paymentId: '1234567890',
  },
});
```
