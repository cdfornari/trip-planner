import { Inject } from '@nestjs/common';
import { CONNECTION_NAME } from './connection-name';

export const InjectSurreal = () => Inject(CONNECTION_NAME);
