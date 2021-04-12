import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { analytics, JSONType, Response } from '@splitbee/core';
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

const loadUid = async () => {
  uid = uid || (await AsyncStorage.getItem('splitbee_uid')) || undefined;
  userId =
    userId || (await AsyncStorage.getItem('splitbee_userId')) || undefined;
};

export const useTrackReactNavigation = (
  ref?: React.MutableRefObject<NavigationContainerRef>
): [
  { onReady: () => void; onStateChange: () => void },
  React.MutableRefObject<NavigationContainerRef | null>
] => {
  const navigationRef = useRef<NavigationContainerRef | null>(null);
  const routeNameRef = useRef<string | null>(null);

  const navRef = ref?.current || navigationRef.current;

  return [
    {
      onReady: () => (routeNameRef.current = navRef?.getCurrentRoute()!.name!),
      onStateChange: async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navRef?.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName) {
          splitbee.screen(currentRouteName!);
        }
        routeNameRef.current = currentRouteName!;
      },
    },
    ref || navigationRef,
  ];
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

const processResponse = async (response: Response | undefined) => {
  if (response?.uid) {
    uid = response.uid;
    await AsyncStorage.setItem(UID_KEY, response.uid);
  }
};

const getContext = async () => ({
  projectId: projectToken,
  uid,
  userId,
  device: await getDeviceInfo(),
});

const splitbee = {
  init: (token: string) => {
    projectToken = token;
    loadUid();
    AppState.removeEventListener('change', onChange);
    AppState.addEventListener('change', onChange);
  },
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
        context: await getContext(),
      });

      processResponse(response);
    }
  },
  track: async (event: string, data?: any) => {
    if (projectToken) {
      const response = await analytics.track({
        event,
        data,
        context: await getContext(),
      });
      processResponse(response);
    }
  },
  identify: async (userData: JSONType) => {
    if (projectToken) {
      const response = await analytics.identify({
        userData,
        context: await getContext(),
      });
      processResponse(response);
    }
  },
};

export default splitbee;
