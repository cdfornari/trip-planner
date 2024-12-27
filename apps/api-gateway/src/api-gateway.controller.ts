import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { catchError } from 'rxjs';
import { Environment } from 'libs/core/utils/environment';
import { RegisterDto } from 'libs/users/infrastructure/register.dto';
import { LoginDto } from 'libs/users/infrastructure/login.dto';
import { AuthGuard } from 'libs/core/infrastructure/auth/auth.guard';
import { User } from 'libs/core/infrastructure/auth/user.decorator';
import { Token } from 'libs/core/infrastructure/auth/token.decorator';
import { CurrentUser } from 'libs/core/infrastructure/auth/current-user.type';

@Controller()
export class ApiGatewayController {
  constructor(
    @Inject(Environment.natsServer) private readonly client: ClientProxy,
    private readonly i18n: I18nService,
  ) {}

  @Post('auth/register')
  register(@Body() dto: RegisterDto) {
    return this.client.send('auth.register', dto).pipe(
      catchError((error) => {
        throw new RpcException({
          ...error,
          message: this.i18n.t(`errors.${error.message}`, {
            lang: I18nContext.current()?.lang,
          }),
        });
      }),
    );
  }

  @Post('auth/login')
  login(@Body() loginUserDto: LoginDto) {
    return this.client.send('auth.login', loginUserDto).pipe(
      catchError((error) => {
        throw new RpcException({
          ...error,
          message: this.i18n.t(`errors.${error.message}`, {
            lang: I18nContext.current()?.lang,
          }),
        });
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('auth/verify')
  verifyToken(@User() user: CurrentUser, @Token() token: string) {
    return { user, token };
  }
}
