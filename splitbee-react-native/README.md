# Splitbee Analytics for React Native Apps

Used to track screen views & events of React Native & Expo Apps using Splitbee.

## Installation

First, you need to install our SDK

```bash
yarn add @splitbee/react-native
```

### Usage with Expo

Install following expo dependencies:

```bash
expo install expo-device expo-constants @react-native-async-storage/async-storage
```

We need those for getting the device data & persisting the user on a device.

### Usage with React Native

Install following dependencies: [@react-native-async-storage/async-storage](`https://react-native-async-storage.github.io/async-storage/docs/install`) & [react-native-device-info](https://github.com/react-native-device-info/react-native-device-info)

```bash
yarn add react-native-device-info @react-native-async-storage/async-storage
npx pod-install
```

Please follow the official documentation of those libraries on how to link them correctly.

## Usage

### Initialize Splitbee

First of all you need to initialize the Splitbee SDK. For that, run `initSplitbee` with your token.

```js
import { initSplitbee } from '@splitbee/react-native';

initSplitbee('YOUR_TOKEN'); // Take the token from the project settings in the Splitbee dashboard
```

## Screen Tracking

### Usage with [react-navigation](https://reactnavigation.org/docs/getting-started)

In this example we are using react-navigation to screen views automatically.

```JSX
import splitbee, { useTrackReactNavigation } from '@splitbee/react-native';

export default function Navigation() {
  const [{ onReady, onStateChange }, navigationRef] = useTrackReactNavigation();

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      ref={navigationRef}
      onReady={() => {
        onReady();
      }}
      onStateChange={() => {
        onStateChange();
      }}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}
```

If you already have a `ref` set for the `NavigationContainer`, just pass it to `useTrackReactNavigation`

```JSX
const navigationRef = useRef(null)
const [{ onReady, onStateChange }] = useTrackReactNavigation(navigationRef);
```

### Usage with [react-native-navigation](https://wix.github.io/react-native-navigation)

To setup automated screen tracking you need to add following code to your `index.js`

```js
Navigation.events().registerComponentDidAppearListener(
  async ({ componentName, componentType }) => {
    if (componentType === 'Component') {
      await splitbee.screen(componentName);
    }
  }
);
```
