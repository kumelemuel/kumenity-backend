export interface HashGeneratorPort {
  generate(value: string): Promise<string>;
}
