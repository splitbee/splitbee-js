import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { analytics } from '@splitbee/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainerRef } from '@react-navigation/native';

import { getActiveSeconds, resetTime } from './timer';
import { getDeviceInfo } from './device';

const UID_KEY = 'splitbee_uid';
const USERID_KEY = 'splitbee_userId';

let projectToken: string | undefined;
let uid: string | undefined;
let userId: string | undefined;
let requestId: string | undefined;
let lastPage: string | undefined;

const generateUid = () =>
  Math.random()
    .toString(36)
    .substring(7);

export const useSplitbee = async (token: string) => {
  const navigationRef = useRef<NavigationContainerRef | null>(null);
  const routeNameRef = useRef<string | null>(null);

  useEffect(() => {
    const loadUid = async () => {
      uid = uid || (await AsyncStorage.getItem(UID_KEY)) || undefined;
      userId = userId || (await AsyncStorage.getItem(USERID_KEY)) || undefined;
    };
    projectToken = token;
    loadUid();
    AppState.addEventListener('change', onChange);
    return () => AppState.removeEventListener('change', onChange);
  }, []);

  return {
    onReady: () =>
      (routeNameRef.current = navigationRef.current?.getCurrentRoute()!.name!),

    onStateChange: async () => {
      const previousRouteName = routeNameRef.current;
      const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

      if (previousRouteName !== currentRouteName) {
        splitbee.screen(currentRouteName!);
      }
      routeNameRef.current = currentRouteName!;
    },
  };
};
const sendEnd = async (closeApp?: boolean) => {
  if (requestId) {
    await analytics.end({
      requestId,
      data: {
        duration: getActiveSeconds(),
        ...(closeApp && { destination: 'close' }),
      },
      context: { projectId: projectToken, uid, userId },
    });
  }
  resetTime();
};

const onChange = async (state: AppStateStatus) => {
  if (state === 'background' && requestId) {
    await sendEnd(true);
  } else if (state === 'active') {
    if (lastPage) {
      splitbee.screen(lastPage);
    }
  }
};

const splitbee = {
  setUserId: (id: string) => {
    userId = id;
    AsyncStorage.setItem(USERID_KEY, id)
      .then(() => {})
      .catch(() => {});
  },
  screen: async (page: string) => {
    sendEnd();
    requestId = generateUid();

    if (projectToken) {
      lastPage = page;
      const response = await analytics.page({
        page,
        data: {
          requestId,
        },
        context: {
          projectId: projectToken,
          uid,
          userId,
          device: await getDeviceInfo(),
        },
      });

      if (response?.uid) {
        uid = response.uid;
        await AsyncStorage.setItem(UID_KEY, response.uid);
      }
    }
  },
  track: async (event: string, data?: any) => {
    if (projectToken) {
      const response = await analytics.track({
        event,
        data,
        context: { projectId: projectToken, uid, userId },
      });
      if (response?.uid) {
        uid = response.uid;
        await AsyncStorage.setItem(UID_KEY, response.uid);
      }
    }
  },
};

export default splitbee;
