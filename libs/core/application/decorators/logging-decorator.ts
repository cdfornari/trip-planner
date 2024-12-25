import { Result } from 'libs/core/utils/result';
import { ApplicationService } from '../service';
import { ILogger } from '../logger.interface';

export const LoggingDecorator =
  <T, R>(logger: ILogger, service: ApplicationService<T, R>) =>
  async (dto: T): Promise<Result<R>> => {
    logger.log(`Executing service with DTO: ${JSON.stringify(dto)}`);
    const result = await service(dto);
    if (result.isFailure) {
      logger.logError(`Service failed with error: ${result.errorMessage}`);
    } else
      logger.log(
        `Service executed successfully with result: ${JSON.stringify(result.unwrap())}`,
      );
    return result;
  };
