import LottieView from 'lottie-react-native';
import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import heroJson from './assets/hero.json';
import { PullingRefreshStatus } from './constants';
import { useMrPullRefreshValue, useOnPulldownState } from './hooks';
const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

export const HeroLottie = () => {
  const lottieRef = useRef<LottieView>(null);

  const ctx = useMrPullRefreshValue();

  const { pulldownHeight, panTranslateY } = ctx;

  const animatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      panTranslateY.value,
      [0, pulldownHeight],
      [pulldownHeight * 0.2, pulldownHeight],
      Extrapolate.CLAMP
    ),
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

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          width: '100%',
          height: pulldownHeight,
          backgroundColor: '#f6f8fa',
        },
      ]}
    >
      <AnimatedLottieView
        style={[styles.fullBox, animatedStyle]}
        ref={lottieRef}
        source={heroJson}
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
