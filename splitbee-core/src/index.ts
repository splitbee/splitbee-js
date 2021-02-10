import { splitbeeRequest, RequestContext, JSONType, EventOptions } from './api';

export const analytics = {
  track: async ({
    event,
    data,
    context,
    options,
  }: {
    event: string;
    data?: JSONType;
    context: RequestContext;
    options?: EventOptions;
  }) => {
    return await splitbeeRequest({
      path: '/t',
      context,
      body: { event, data, options },
    });
  },

  page: async ({
    page,
    data,
    context,
    options,
  }: {
    page: string;
    data?: { referrer?: string; requestId?: string };
    context: RequestContext;
    options?: EventOptions;
  }) => {
    return await splitbeeRequest({
      path: '/i',
      context,
      body: {
        origin: page,
        ...(data?.referrer && { referrer: data.referrer }),
        ...(data?.requestId && { requestId: data.requestId }),
        options,
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
    return await splitbeeRequest({
      path: '/user',
      context,
      body: userData,
    });
  },
};

export { RequestContext, JSONType };
