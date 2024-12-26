import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { hashSync, compareSync } from 'bcrypt';
import { CreateUserCommandHandler } from 'libs/users/application/create-user.command-handler';
import { EventStoreService } from 'libs/core/infrastructure/event-store/event-store.service';
import { UuidGenerator } from 'libs/core/infrastructure/uuid/uuid-generator';
import { RegisterDto } from 'libs/users/infrastructure/register.dto';
import { LoginDto } from 'libs/users/infrastructure/login.dto';

type JwtPayload = {
  id: string;
  email: string;
  name: string;
};

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  private readonly redis: Redis | null;

  constructor(
    private readonly redisService: RedisService,
    private readonly eventStore: EventStoreService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  async onApplicationBootstrap() {
    try {
      await this.redis.sendCommand(
        new Redis.Command(
          'FT.CREATE',
          [
            'idx:users',
            'ON',
            'JSON',
            'PREFIX',
            1,
            'user:',
            'SCHEMA',
            '$.emailuser',
            'AS',
            'emailuser',
            'TEXT',
            '$.emaildomain',
            'AS',
            'emaildomain',
            'TEXT',
          ],
          {
            replyEncoding: 'utf8',
          },
        ),
      );
    } catch (error) {}
  }

  private async signJWT(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private async getUserById(id: string) {
    const result = await this.redis.call('JSON.GET', `user:${id}`);
    if (!result) {
      return null;
    }
    const { email, password, name } = JSON.parse(result.toString());
    return {
      id,
      email,
      password,
      name,
    };
  }

  private async getUserByEmail(email: string) {
    const [emailUser, emailDomain] = email.split('@');
    const result = await this.redis.call(
      'FT.SEARCH',
      'idx:users',
      `@emailuser:${emailUser} @emaildomain:${emailDomain}`,
    );
    if (!result || result[0] === 0) {
      return null;
    }
    const { password, name } = JSON.parse(result[2][1]);
    return {
      id: result[1].split(':')[1],
      email,
      password,
      name,
    };
  }

  async register(dto: RegisterDto) {
    const user = await this.getUserByEmail(dto.email);
    if (user)
      throw new RpcException({
        message: 'USER_ALREADY_EXISTS',
        status: 400,
      });
    const commandHandler = CreateUserCommandHandler(
      this.eventStore,
      new UuidGenerator(),
    );
    const result = await commandHandler(dto);
    const { id } = result.unwrap();
    const [emailuser, emaildomain] = dto.email.split('@');
    await this.redis.call(
      'JSON.SET',
      `user:${id}`,
      '$',
      JSON.stringify({
        ...dto,
        password: hashSync(dto.password, 10),
        emailuser,
        emaildomain,
      }),
    );
    return {
      id,
      email: dto.email,
      name: dto.name,
      token: await this.signJWT({ id, email: dto.email, name: dto.name }),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.getUserByEmail(dto.email);
    if (!user)
      throw new RpcException({
        message: 'USER_NOT_FOUND',
        status: 400,
      });
    if (!compareSync(dto.password, user.password))
      throw new RpcException({
        message: 'INVALID_PASSWORD',
        status: 400,
      });
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      token: await this.signJWT({
        id: user.id,
        email: user.email,
        name: user.name,
      }),
    };
  }

  async verifyToken(token: string) {
    try {
      const { sub, iat, exp, ...user } = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
      });
      return {
        user: user,
        token: await this.signJWT(user),
      };
    } catch (error) {
      console.log(error);
      throw new RpcException({
        status: 401,
        message: 'Invalid token',
      });
    }
  }
}
