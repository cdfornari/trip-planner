import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { firstValueFrom } from 'rxjs';
import { Environment } from 'libs/core/utils/environment';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(Environment.natsServer) private readonly client: ClientProxy,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(
        this.i18n.t('errors.INVALID_TOKEN', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }
    try {
      const { user, token: newToken } = await firstValueFrom(
        this.client.send('auth.verify', token),
      );
      request['user'] = user;
      request['token'] = newToken;
    } catch (error) {
      throw new UnauthorizedException(
        error.message &&
          this.i18n.t(`errors.${error.message}`, {
            lang: I18nContext.current()?.lang,
          }),
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
