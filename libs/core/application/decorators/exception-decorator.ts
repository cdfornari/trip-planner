import { Result } from 'libs/core/utils/result';
import { ApplicationService } from '../service';

export const ExceptionDecorator =
  <T, R>(service: ApplicationService<T, R>) =>
  async (dto: T): Promise<Result<R>> => {
    try {
      const result = await service(dto);
      if (result.isFailure) result.unwrap();
      return result;
    } catch (error) {
      return Promise.resolve(Result.failure(error));
    }
  };
