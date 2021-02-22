# splitbee-react-native

Used to track events in Splitbee for React Native & Expo Apps.

### Usage with automated page tracking

In this example we are using react-navigation to track page views automatically.

```js
import splitbee, { useSplitbee } from '@splitbee/react-native';

export default function Navigation() {
  const [navigationTrackingProps, navigationRef] = useSplitbee('PROJECT_TOKEN');

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      ref={navigationRef}
      {...navigationTrackingProps}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}
```
