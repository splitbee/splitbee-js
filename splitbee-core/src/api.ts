export type Device = {
  os: { name: string; version: string };
  client: {
    name: string; //'Opera';
    type: string; //'browser';
    // engine: 'Blink';
    // engineVersion: '';
    version: string; //'73.0';
  };
  device: {
    type: string; //'desktop';
    brand: string; // 'Apple';
    model: string; // '';
  };
};

export interface RequestContext {
  projectId?: string;
  userId?: string;
  uid?: string;
  userAgent?: string;
  device?: Device;
}
interface GenericRequest {
  context?: RequestContext;
}

export type JSONType = { [key: string]: string | number | boolean };

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

interface EndRequest extends GenericRequest {
  path: '/end';
  body: {
    requestId: string;
    data: {
      duration: number;
    };
  };
}

type Requests = PageViewRequest | EventRequest | IdentifyRequest | EndRequest;

export type Response = {
  uid: string;
};

let ENDPOINT = `https://hive.splitbee.io`;

export const setEndpoint = (endpoint: string) => (ENDPOINT = endpoint);

export const splitbeeRequest = async ({
  path,
  context,
  body,
}: Requests): Promise<Response | undefined> => {
  try {
    const res = await fetch(ENDPOINT + path, {
      method: 'POST',
      headers: {
        ...(context?.userId &&
          context.userId !== '' && { userId: context.userId }),
        ...(context?.uid && { uid: context.uid }),
        ...(context?.projectId && { sbp: context.projectId }),
        ...(context?.userAgent && { 'user-agent': context.userAgent }),
        ...(context?.device && { device: JSON.stringify(context.device) }),
        // ...(event.context.page && { origin: event.context.page.url }),
      },
      body: JSON.stringify(body),
    });

    if (typeof process.env !== undefined && res.status !== 200) {
      const body = await res.json();
      console.log('Splitbee Error: ', body);
    }
    return {
      uid: res.headers.get('uid')!,
    };
  } catch (err) {
    return undefined;
  }
};
