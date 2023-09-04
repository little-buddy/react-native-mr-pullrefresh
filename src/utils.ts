//
import React from 'react';
import { Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkChildren = (children: React.ReactElement<unknown, any>) => {
  const onlyChild = React.Children.only(children);

  if ([Animated.FlatList, Animated.ScrollView].includes(onlyChild.type)) {
    return onlyChild;
  }

  throw new Error(`[react-native-mr-pullrefresh]
    MrPullRefresh only support
      Animated.ScrollView、
      Animated.FlatList
    as a Child`);
};
