declare module 'dotenv-safe' {
  interface DotenvSafeOptions {
    path?: string;
    sample?: string;
    allowEmptyValues?: boolean;
    strict?: boolean;
    ignorePrototype?: boolean;
  }

  interface DotenvSafeOutput {
    parsed: Record<string, string>;
    required: string[];
  }

  function config(options?: DotenvSafeOptions): DotenvSafeOutput;

  export default { config };
}
