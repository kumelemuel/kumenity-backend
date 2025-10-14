import { randomUUID } from 'crypto';
import { UserId } from '@domain/identity-access/value-objects/user-id.vo';

describe('UserId Value Object', () => {
  it('should create a valid UUID', () => {
    const id = UserId.create();
    expect(id.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('should accept an existing valid UUID', () => {
    const existing = randomUUID();
    const id = UserId.create(existing);
    expect(id.value).toBe(existing);
  });

  it('should throw an error for invalid UUID', () => {
    expect(() => UserId.create('invalid-uuid')).toThrow();
  });

  it('should compare equality correctly', () => {
    const existing = randomUUID();
    const id1 = UserId.create(existing);
    const id2 = UserId.create(existing);
    expect(id1.equals(id2)).toBe(true);
  });
});
