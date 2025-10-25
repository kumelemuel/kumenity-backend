import jwt, { Secret } from 'jsonwebtoken';
import { TokenGeneratorPort } from '../../application/ports/out/token-generator.port';

export const SECRET_KEY: Secret = 'your-secret-key-here';

export class JwtTokenGeneratorAdapter implements TokenGeneratorPort {
  sign(payload: Record<string, unknown>): string {
    return jwt.sign(payload, SECRET_KEY, {
      expiresIn: '2 days',
    });
  }

  verify(token: string): Record<string, unknown> | null {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded as Record<string, unknown>;
  }
}
