import 'source-map-support/register';

declare global {
  type PromiseCallback<T> = (value?: T | PromiseLike<T>) => void;
}
