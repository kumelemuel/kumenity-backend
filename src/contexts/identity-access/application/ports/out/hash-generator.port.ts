export interface HashGeneratorPort {
  generate(value: string): Promise<string>;
  compare(value: string, hash: string): Promise<boolean>;
}
