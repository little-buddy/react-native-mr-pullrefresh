import { useContext } from 'react';
import {
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { type PullingRefreshStatus } from './constants';
import { MrPullRefreshContext } from './context';
import { getWindowHeight } from './utils';

const windowHeight = getWindowHeight();

export const useMrPullRefreshValue = () => {
  const value = useContext(MrPullRefreshContext);

  return value;
};

export const useOnPulldownState = (
  onChange: (value: PullingRefreshStatus) => void
) => {
  const ctx = useMrPullRefreshValue();

  // FIXME: Why always re-render
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

  const { pulldownHeight, panTranlateY } = ctx;

  const x = useAnimatedStyle(() => ({
    height: pulldownHeight,
    opacity: interpolate(panTranlateY.value, [0, pulldownHeight], [0, 1]),
    transform: [
      {
        translateY: interpolate(
          panTranlateY.value,
          [0, pulldownHeight, windowHeight],
          [-pulldownHeight, 0, 0]
        ),
      },
    ],
  }));

  return x;
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

  const { pullupHeight, panTranlateY } = ctx;

  return useAnimatedStyle(() => ({
    height: pullupHeight,
    opacity: interpolate(-panTranlateY.value, [0, pullupHeight], [0, 1]),
    translateY: interpolate(
      -panTranlateY.value,
      [0, pullupHeight, windowHeight],
      [pullupHeight, 0, 0]
    ),
  }));
};
