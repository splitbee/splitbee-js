import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const getOSName = () => {
  switch (Platform.OS) {
    case 'ios':
      return 'iOS';
    case 'android':
      return 'Android';
    case 'windows':
      return 'Windows';
    case 'web':
      return 'Web';
    case 'macos':
      return 'MacOS';
  }
};

export const getDeviceInfo = async () => {
  return {
    os: {
      name: getOSName(),
      version: Platform.Version,
    },
    client: {
      name: 'React Native',
      type: 'app',
      version: await DeviceInfo.getVersion(),
      build: await DeviceInfo.getBuildNumber(),
    },
    device: {
      type: (await DeviceInfo.isTablet()) ? 'tablet' : 'smartphone',
      brand: await DeviceInfo.getManufacturer(),
      model: await DeviceInfo.getModel(),
      deviceId: await DeviceInfo.getDeviceId(),
    },
  };
};
