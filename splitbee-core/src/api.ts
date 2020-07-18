export interface RequestContext {
  projectId?: string;
  userId?: string;
  anonymousId?: string;
  userAgent?: string;
}
interface GenericRequest {
  context?: RequestContext;
}

export type JSONType = { [key: string]: string | number };

interface PageViewRequest extends GenericRequest {
  path: '/i';
  body: {
    referrer?: string;
    requestId?: string;
    origin?: string;
    page?: string;
  };
}

export interface EventRequest extends GenericRequest {
  path: '/track';
  body: {
    event: string;
    data?: JSONType;
  };
}

interface IdentifyRequest extends GenericRequest {
  path: '/user';
  body: JSONType;
}

type Requests = PageViewRequest | EventRequest | IdentifyRequest;

export const splitbeeRequest = async ({ path, context, body }: Requests) => {
  await fetch(`https://hive.splitbee.io` + path, {
    method: 'POST',
    headers: {
      ...(context?.userId && { userId: context.userId }),
      ...(context?.anonymousId && { uid: context.anonymousId }),
      ...(context?.projectId && { sbp: context.projectId }),
      ...(context?.userAgent && { 'user-agent': context.userAgent }),
      // ...(event.context.page && { origin: event.context.page.url }),
    },
    body: JSON.stringify(body),
  });
};
