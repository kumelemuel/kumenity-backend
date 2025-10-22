import { ValueObject } from '../../../../shared/value-object';
import { InvalidArgumentError } from '../../../../shared/exceptions/invalid-argument.error';

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): Email {
    if (!Email.isValid(value)) {
      throw new InvalidArgumentError(`Invalid email: ${value}`);
    }

    return new Email({ value: value.toLowerCase() });
  }

  public static isValid(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }
}
