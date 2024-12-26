import { v4 as uuidv4 } from 'uuid';
import { IdGenerator } from 'libs/core/application/id-generator';

export class UuidGenerator implements IdGenerator<string> {
  generateId(): string {
    return uuidv4();
  }
}
