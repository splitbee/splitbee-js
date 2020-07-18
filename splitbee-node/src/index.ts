import 'cross-fetch/polyfill';
import { analytics } from '@splitbee/core';
import { EventRequest, JSONType } from 'splitbee-core/dist/api';

export class SplitbeeAnalytics {
  private projectId?: string;
  constructor(projectId: string) {
    this.projectId = projectId;
  }

  public track = async ({
    userId,
    uid,
    event,
    data,
  }: {
    event: string;
    data?: EventRequest['body']['data'];
    userId?: string;
    uid?: string;
  }) => {
    await analytics.track({
      event,
      data,
      context: { projectId: this.projectId, userId, anonymousId: uid },
    });
  };

  public page = async ({
    page,
    data,
    userId,
    uid,
  }: {
    page: string;
    data?: { referrer?: string; requestId?: string };
    userId?: string;
    uid?: string;
  }) => {
    await analytics.page({
      page,
      data,
      context: { projectId: this.projectId, userId, anonymousId: uid },
    });
  };

  public identify = async ({
    userData,
    userId,
    uid,
  }: {
    userData: JSONType;
    userId?: string;
    uid?: string;
  }) => {
    await analytics.identify({
      userData,
      context: { projectId: this.projectId, userId, anonymousId: uid },
    });
  };
}
