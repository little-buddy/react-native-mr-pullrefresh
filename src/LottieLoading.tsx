import LottieView from 'lottie-react-native';
import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

import heroJson from './assets/hero.json';
// import heroLottie from './assets/hero.lottie';
import { PullingRefreshStatus } from './constants';
import { useMrPullRefreshValue, useOnPulldownState } from './hooks';
import { actuallyMove } from './utils';
const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

export const HeroLottie = () => {
  const lottieRef = useRef<LottieView>(null);

  const ctx = useMrPullRefreshValue();

  const {
    pulldownHeight,
    panTranslateY,
    pulldownState,
    containerY,
    pullingFactor,
  } = ctx;

  const animatedStyle = useAnimatedStyle(() => ({
    height: Math.min(panTranslateY.value, pulldownHeight),
    opacity: interpolate(panTranslateY.value, [0, pulldownHeight], [0, 1]),
  }));

  useOnPulldownState(value => {
    if (value === PullingRefreshStatus.PULLINGGO) {
      lottieRef.current?.play();
    }

    if (value === PullingRefreshStatus.BACKUP) {
      lottieRef.current?.reset();
    }
  });

  const progress = useDerivedValue(() =>
    [PullingRefreshStatus.BACKUP, PullingRefreshStatus.PULLING].includes(
      pulldownState.value
    )
      ? interpolate(
          actuallyMove(panTranslateY.value, containerY.value),
          [0, pulldownHeight * pullingFactor],
          [0, 1],
          Extrapolate.CLAMP
        )
      : undefined
  );

  // TODO: Fixed Do it.
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          width: '100%',
          height: pulldownHeight,
        },
      ]}
    >
      <AnimatedLottieView
        progress={progress}
        style={[styles.fullBox, animatedStyle]}
        ref={lottieRef}
        source={heroJson}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // sourceDotLottieURI={heroLottie}
        autoPlay={true}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fullBox: {
    width: '100%',
    height: '100%',
  },
});
