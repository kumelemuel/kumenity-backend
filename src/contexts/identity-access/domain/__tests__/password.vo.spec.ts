import { Password } from '../value-objects/password.vo';

describe('Password Value Object', () => {
  it('should create a valid password', () => {
    const valid_password =
      '$2a$12$DIvmJUDVluP4xvSgJLSNxukhXU1TcFpp.exoMiIcJXvKCRSy33gI6';
    const password = Password.create(valid_password);
    expect(password.value).toBe(valid_password);
  });

  it('should throw if password is not bcrypt hash', () => {
    expect(() => Password.create('test')).toThrow('Invalid password format');
  });
});
