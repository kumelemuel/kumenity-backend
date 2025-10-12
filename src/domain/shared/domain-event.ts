export abstract class DomainEvent {
  readonly occurredOn: Date;
  readonly eventName: string;

  protected constructor(eventName: string) {
    this.eventName = eventName;
    this.occurredOn = new Date();
  }
}
