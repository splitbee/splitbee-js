import { splitbeeRequest, RequestContext, EventRequest, JSONType } from './api';

export const analytics = {
  track: async ({
    event,
    data,
    context,
  }: {
    event: string;
    data?: EventRequest['body']['data'];
    context: RequestContext;
  }) => {
    await splitbeeRequest({
      path: '/track',
      context,
      body: { event, data },
    });
  },

  page: async ({
    page,
    data,
    context,
  }: {
    page: string;
    data?: { referrer?: string; requestId?: string };
    context: RequestContext;
  }) => {
    await splitbeeRequest({
      path: '/i',
      context,
      body: {
        origin: page,
        ...(data?.referrer && { referrer: data.referrer }),
        ...(data?.requestId && { requestId: data.requestId }),
      },
    });
  },

  identify: async ({
    userData,
    context,
  }: {
    userData: JSONType;
    context: RequestContext;
  }) => {
    await splitbeeRequest({
      path: '/user',
      context,
      body: userData,
    });
  },
};
