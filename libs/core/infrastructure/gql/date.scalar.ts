import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date')
export class DateScalar implements CustomScalar<string, string> {
  description = 'Date custom scalar type';

  parseValue(value: string): string {
    return new Date(value).toISOString().slice(0, 10) + 'T04:30:00.000Z'; // value from the client
  }

  serialize(value: Date): string {
    return value.toDateString(); // value sent to the client
  }

  parseLiteral(ast: ValueNode): string {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value).toISOString().slice(0, 10) + 'T04:30:00.000Z';
    }
    return null;
  }
}
