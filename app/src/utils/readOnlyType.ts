export type ReadOnlyType<T> = {
  readonly [P in keyof T]: T[P];
};
