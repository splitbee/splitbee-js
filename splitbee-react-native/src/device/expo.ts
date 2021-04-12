import * as Device from 'expo-device';
import Constants from 'expo-constants';

const getDeviceType = (device: Device.DeviceType) => {
  switch (device) {
    case Device.DeviceType.DESKTOP:
      return 'desktop';
    case Device.DeviceType.PHONE:
      return 'smartphone';
    case Device.DeviceType.TABLET:
      return 'tablet';
    case Device.DeviceType.TV:
      return 'tv';
    case Device.DeviceType.UNKNOWN:
      return undefined;
  }
};

export const getDeviceInfo = async () => {
  return {
    os: {
      name: Device.osName,
      version: Device.osVersion,
    },
    client: {
      name: 'React Native',
      type: 'app',
      version: Constants.nativeAppVersion,
      build: Constants.nativeBuildVersion,
    },
    device: {
      type: getDeviceType(await Device.getDeviceTypeAsync()),
      brand: Device.brand,
      model: Constants.deviceName || Device.modelName,
      deviceId: Device.modelId,
    },
  };
};
