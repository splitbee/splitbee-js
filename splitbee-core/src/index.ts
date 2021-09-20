import {
  splitbeeRequest,
  RequestContext,
  JSONType,
  EventData,
  EventOptions,
  setEndpoint,
  Response,
} from './api';

export const analytics = {
  track: async ({
    event,
    data,
    context,
    options,
  }: {
    event: string;
    data?: EventData;
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
        page,
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
    userData: EventData;
    context: RequestContext;
  }) => {
    return await splitbeeRequest({
      path: '/user',
      context,
      body: userData,
    });
  },

  end: async ({
    requestId,
    data,
    context,
  }: {
    requestId: string;
    data: {
      duration: number;
      destination?: string;
    };
    context: RequestContext;
  }) => {
    return await splitbeeRequest({
      path: '/end',
      context,
      body: {
        requestId,
        data,
      },
    });
  },
};

export {
  RequestContext,
  EventOptions,
  JSONType,
  EventData,
  Response,
  setEndpoint,
};
