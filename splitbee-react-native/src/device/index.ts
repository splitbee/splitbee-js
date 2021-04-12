let deviceInfo;

try {
  require('expo-device');
  const { getDeviceInfo } = require('./expo');
  deviceInfo = getDeviceInfo;
  console.log('could load expo');
} catch (error) {
  console.log('no expo');
  console.log(error);
  const { getDeviceInfo } = require('./native');
  deviceInfo = getDeviceInfo;
}

export const getDeviceInfo = deviceInfo;
