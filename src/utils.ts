//

import { Dimensions } from 'react-native';

export const delayTime = (time = 1000) =>
  new Promise((resolve: PromiseCallback<unknown>) => {
    setTimeout(() => resolve(null), time);
  });

export const getWindowHeight = () => Dimensions.get('window').height;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isPromise = (p: any) => {
  if (typeof p === 'object' && typeof p.then === 'function') {
    return true;
  }

  return false;
};
