import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor() {}

/*@MessagePattern('auth.register.user')
  registerUser(@Payload() registerUserDto: RegisterUserDto) {}

  @MessagePattern('auth.login.user')
  loginUser(@Payload() loginUserDto: LoginUserDto) {}

  @MessagePattern('auth.verify.user')
  verifyToken(@Payload() token: string) {} */
}
