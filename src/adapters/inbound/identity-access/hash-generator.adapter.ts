import { HashGeneratorPort } from '@application/identity-access/ports/outbound/hash-generator.port';
import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

export class HashGeneratorAdapter implements HashGeneratorPort {
  async generate(value: string): Promise<string> {
    return await bcrypt.hash(value, saltOrRounds);
  }
}
