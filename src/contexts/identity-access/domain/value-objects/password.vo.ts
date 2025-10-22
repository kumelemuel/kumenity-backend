import { ValueObject } from '../../../../shared/value-object';
import { InvalidArgumentError } from '../../../../shared/exceptions/invalid-argument.error';

interface PasswordProps {
  value: string;
}

export class Password extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): Password {
    if (!Password.isValid(value)) {
      throw new InvalidArgumentError('Invalid password format');
    }

    return new Password({ value });
  }

  public static isValid(value: string): boolean {
    // - Bcrypt hash format
    const regex = /^\$2[ayb]\$.{56}$/;
    return regex.test(value);
  }
}
