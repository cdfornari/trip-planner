import { SetMetadata } from '@nestjs/common';

export const SAGA_KEY = 'SAGA_KEY';
export const SagaStep: ClassDecorator = SetMetadata(SAGA_KEY, true);
