import { Inject } from '@nestjs/common';
import { CONNECTION_NAME } from './connection-name';

export const InjectEventStore = () => Inject(CONNECTION_NAME);
