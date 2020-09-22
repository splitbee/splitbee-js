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
    options?: EventOptions;
  };
}

export interface EventOptions {
  updateLastSeen?: boolean;
  __uid?: string;
}
export interface EventRequest extends GenericRequest {
  path: '/t';
  body: {
    event: string;
    data?: JSONType;
    options?: EventOptions;
  };
}

interface IdentifyRequest extends GenericRequest {
  path: '/user';
  body: JSONType;
}

type Requests = PageViewRequest | EventRequest | IdentifyRequest;

export const splitbeeRequest = async ({
  path,
  context,
  body,
}: Requests): Promise<boolean> => {
  try {
    const res = await fetch(`https://hive.splitbee.io` + path, {
      method: 'POST',
      headers: {
        ...(context?.userId &&
          context.userId !== '' && { userId: context.userId }),
        ...(context?.anonymousId && { uid: context.anonymousId }),
        ...(context?.projectId && { sbp: context.projectId }),
        ...(context?.userAgent && { 'user-agent': context.userAgent }),
        // ...(event.context.page && { origin: event.context.page.url }),
      },
      body: JSON.stringify(body),
    });
    if (typeof process.env !== undefined && res.status !== 200) {
      const body = await res.json();
      console.log('Splitbee Error: ', body);
    }
    return true;
  } catch (err) {
    return false;
  }
};
