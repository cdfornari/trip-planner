import { SetMetadata } from '@nestjs/common';

export const SUBSCRIPTION_KEY = 'SUBSCRIPTION_KEY';
export const SubscribeToGroup = (groupName: string) =>
  SetMetadata(SUBSCRIPTION_KEY, groupName);
