import { randomUUID } from 'crypto';
import { ValueObject } from '../../../../shared/value-object';
import { InvalidArgumentError } from '../../../../shared/exceptions/invalid-argument.error';

interface UserIdProps {
  value: string;
}

export class UserId extends ValueObject<UserIdProps> {
  private constructor(props: UserIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value?: string): UserId {
    const id = value ?? randomUUID();

    if (!UserId.isValid(id)) {
      throw new InvalidArgumentError(`Invalid UUID: ${id}`);
    }

    return new UserId({ value: id });
  }

  private static isValid(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
}
