import { Email } from '@domain/identity-access/value-objects/email.vo';

describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const email = Email.create('user@example.com');
    expect(email.value).toBe('user@example.com');
  });

  it('should throw an error for invalid email', () => {
    expect(() => Email.create('invalid-email')).toThrow();
  });

  it('should be equal when values are the same', () => {
    const email1 = Email.create('test@example.com');
    const email2 = Email.create('test@example.com');
    expect(email1.equals(email2)).toBe(true);
  });

  it('should not be equal when values are different', () => {
    const email1 = Email.create('a@example.com');
    const email2 = Email.create('b@example.com');
    expect(email1.equals(email2)).toBe(false);
  });
});
