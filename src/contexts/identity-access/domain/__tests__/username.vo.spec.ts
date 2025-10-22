import { Username } from '../value-objects/username.vo';

describe('Username Value Object', () => {
  it('should create a valid username', () => {
    const username = Username.create('valid_user123');
    expect(username.value).toBe('valid_user123');
  });

  it('should throw if username contains uppercase letters', () => {
    expect(() => Username.create('InvalidUser')).toThrow(
      'Invalid username format',
    );
  });

  it('should throw if username is too short', () => {
    expect(() => Username.create('ab')).toThrow('Invalid username format');
  });

  it('should throw if username contains special characters', () => {
    expect(() => Username.create('invalid$user')).toThrow(
      'Invalid username format',
    );
  });

  it('should be equal to another Username with same value', () => {
    const a = Username.create('user123');
    const b = Username.create('user123');
    expect(a.equals(b)).toBe(true);
  });

  it('should not be equal to a different Username', () => {
    const a = Username.create('user123');
    const b = Username.create('otheruser');
    expect(a.equals(b)).toBe(false);
  });
});
