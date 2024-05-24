import type { RequireExactlyOne } from 'type-fest';

type ErrorType = { message: unknown; desc?: string };
type Result<T> = RequireExactlyOne<{
  value: T;
  error: ErrorType;
}>;

type AsyncFunction<T extends Array<unknown>, S> = (...args: T) => Promise<S>;

export function wrapResult<T extends unknown[], S>(
  fn: AsyncFunction<T, S>,
  desc?: string
): AsyncFunction<T, Result<S>> {
  const wrappedFn = async function (...args: T): Promise<Result<S>> {
    try {
      const ret = await fn(...args);
      return { value: ret };
    } catch (error: unknown) {
      return { error: { message: error, desc } };
    }
  };
  return wrappedFn;
}

export function unwrapAndThrow<T>(result: Result<T>): T {
  if (result.error) {
    throw result.error.message;
  }
  return result.value;
}
