import { SetMetadata } from '@nestjs/common';

export const SUBSCRIPTION_KEY = 'SUBSCRIPTION_KEY';
export const SubscribeToGroup = (
  eventType: 'ALL' | string | string[],
  groupName: string,
) =>
  SetMetadata(
    SUBSCRIPTION_KEY,
    JSON.stringify({
      eventType,
      groupName,
    }),
  );
