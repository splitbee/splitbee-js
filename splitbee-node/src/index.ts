import 'cross-fetch/polyfill';
import { analytics, EventData, EventOptions } from '@splitbee/core';

export class SplitbeeAnalytics {
  private projectId?: string;
  constructor(projectId: string) {
    this.projectId = projectId;
  }

  public track = async (
    {
      userId,
      event,
      data,
    }: {
      userId: string;
      event: string;
      data?: EventData;
    },
    options?: EventOptions
  ) => {
    await analytics.track({
      event,
      data,
      options,
      context: {
        projectId: this.projectId,
        userId,
        uid: options?.__uid,
      },
    });
  };

  public page = async (
    {
      page,
      data,
      userId,
    }: {
      page: string;
      data?: { referrer?: string; requestId?: string };
      userId: string;
    },
    options?: EventOptions
  ) => {
    await analytics.page({
      page,
      data,
      options,
      context: {
        projectId: this.projectId,
        userId,
        uid: options?.__uid,
      },
    });
  };

  public user = {
    set: async (
      {
        userData,
        userId,
      }: {
        userData: EventData;
        userId: string;
      },
      options?: EventOptions
    ) => {
      await analytics.identify({
        userData,
        context: {
          projectId: this.projectId,
          userId,
          uid: options?.__uid,
        },
      });
    },
  };
}
