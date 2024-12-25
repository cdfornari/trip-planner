import { Result } from '../utils/result';

export type ApplicationService<T, R> = (dto: T) => Promise<Result<R>>;
