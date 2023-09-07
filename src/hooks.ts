import { useContext } from 'react';
import {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { type PullingRefreshStatus } from './constants';
import { MrPullRefreshContext } from './context';

export const useMrPullRefreshValue = () => {
  const value = useContext(MrPullRefreshContext);

  return value;
};

export const useOnPulldownState = (
  onChange: (value: PullingRefreshStatus) => void
) => {
  const ctx = useMrPullRefreshValue();

  useAnimatedReaction(
    () => ctx.pulldownState.value,
    (current, prev) => {
      if (current !== prev) {
        runOnJS(onChange)(current);
      }
    },
    []
  );
};

export const usePulldownLoadingAnimation = () => {
  const ctx = useMrPullRefreshValue();

  const { pulldownHeight, panTranslateY } = ctx;

  return useAnimatedStyle(() => ({
    height: pulldownHeight,
    opacity: interpolate(panTranslateY.value, [0, pulldownHeight], [0, 1]),
    transform: [
      {
        translateY: interpolate(
          panTranslateY.value,
          [0, pulldownHeight * 2],
          [-pulldownHeight * 2, 0],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));
};

export const useOnPullupState = (
  onChange: (value: PullingRefreshStatus) => void
) => {
  const ctx = useMrPullRefreshValue();

  useAnimatedReaction(
    () => ctx.pullupState.value,
    (current, prev) => {
      if (current !== prev) {
        runOnJS(onChange)(current);
      }
    }
  );
};

export const usePullupLoadingAnimation = () => {
  const ctx = useMrPullRefreshValue();

  const { pullupHeight, panTranslateY } = ctx;

  return useAnimatedStyle(() => ({
    height: pullupHeight,
    opacity: interpolate(-panTranslateY.value, [0, pullupHeight], [0, 1]),
    transform: [
      {
        translateY: interpolate(
          -panTranslateY.value,
          [0, pullupHeight],
          [pullupHeight, 0],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));
};
