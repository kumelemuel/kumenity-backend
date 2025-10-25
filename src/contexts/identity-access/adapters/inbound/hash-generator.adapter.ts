import { HashGeneratorPort } from '../../application/ports/out/hash-generator.port';
import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

export class HashGeneratorAdapter implements HashGeneratorPort {
  compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
  async generate(value: string): Promise<string> {
    return await bcrypt.hash(value, saltOrRounds);
  }
}
