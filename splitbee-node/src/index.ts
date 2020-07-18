import 'unfetch/polyfill';
import { analytics } from '@splitbee/core';
import { EventRequest, JSONType } from 'splitbee-core/dist/api';

export class Analytics {
  private projectId?: string;
  constructor(projectId: string) {
    this.projectId = projectId;
  }

  public track = async ({
    userId,
    event,
    data,
  }: {
    event: string;
    data?: EventRequest['body']['data'];
    userId?: string;
  }) => {
    await analytics.track({
      event,
      data,
      context: { projectId: this.projectId, userId },
    });
  };

  public page = async ({
    page,
    data,
    userId,
  }: {
    page: string;
    data?: { referrer?: string; requestId?: string };
    userId?: string;
  }) => {
    await analytics.page({
      page,
      data,
      context: { projectId: this.projectId, userId },
    });
  };

  public identify = async ({
    userData,
    userId,
  }: {
    userData: JSONType;
    userId?: string;
  }) => {
    await analytics.identify({
      userData,
      context: { projectId: this.projectId, userId },
    });
  };
}

// Demo

// const a = new Analytics('abcdef');

// a.track({ userId: 'abc', event: 'test' });

// a.track('Testing it', { testing: 'abc', count: 1 });
// a.page('Dashboard');
// a.page('https://splitbee.io/page');
