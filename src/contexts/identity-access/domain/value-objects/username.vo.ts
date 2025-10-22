import { ValueObject } from '../../../../shared/value-object';
import { InvalidArgumentError } from '../../../../shared/exceptions/invalid-argument.error';

interface UsernameProps {
  value: string;
}

export class Username extends ValueObject<UsernameProps> {
  private constructor(props: UsernameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): Username {
    if (!Username.isValid(value)) {
      throw new InvalidArgumentError('Invalid username format');
    }

    return new Username({ value: value.toLowerCase() });
  }

  public static isValid(value: string): boolean {
    // Username rules:
    // - Start with a letter
    // - Only lowercase letters, numbers, dots and underscores
    // - Don't start or end with a dot or underscore
    // - Don't have consecutive dots or underscores'
    // - Length between 5 and 20 characters
    const regex = /^(?!.*[._]{2})(?!.*[._]$)[a-z][a-z0-9._]{4,19}$/;
    return regex.test(value);
  }
}
