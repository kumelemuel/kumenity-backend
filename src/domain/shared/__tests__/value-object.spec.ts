import { ValueObject } from '../value-object';

interface NameProps {
  first: string;
  last: string;
}

class Name extends ValueObject<NameProps> {
  get first() {
    return this.props.first;
  }

  get last() {
    return this.props.last;
  }
}

describe('ValueObject base class', () => {
  it('should compare two identical value objects as equal', () => {
    const name1 = new Name({ first: 'John', last: 'Doe' });
    const name2 = new Name({ first: 'John', last: 'Doe' });
    expect(name1.equals(name2)).toBe(true);
  });

  it('should compare different value objects as not equal', () => {
    const name1 = new Name({ first: 'John', last: 'Doe' });
    const name2 = new Name({ first: 'Jane', last: 'Doe' });
    expect(name1.equals(name2)).toBe(false);
  });
});
