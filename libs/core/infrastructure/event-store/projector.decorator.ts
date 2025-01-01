import { SetMetadata } from '@nestjs/common';

export const PROJECTOR_KEY = 'PROJECTOR_KEY';
export const Projector: ClassDecorator = SetMetadata(PROJECTOR_KEY, true);
