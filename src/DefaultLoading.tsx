import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';

import { PullingRefreshStatus } from './constants';
import {
  useOnPulldownState,
  useOnPullupState,
  usePulldownLoadingAnimation,
  usePullupLoadingAnimation,
} from './hooks';

// note: react-native-reanimated only suppot style-animation

interface LoadingProps {
  animating?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ animating }) => (
  <>
    <ActivityIndicator animating={animating} color="#782aeb" />
    <Text style={styles.ml8}>Loading</Text>
  </>
);

export const PulldownLoading = () => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [animating, setAnimating] = useState<boolean>(false);
  useOnPulldownState((state: PullingRefreshStatus) => {
    if (
      [
        PullingRefreshStatus.LOADING,
        PullingRefreshStatus.PULLINGGO,
        PullingRefreshStatus.PULLINGBACK,
      ].includes(state)
    ) {
      setAnimating(true);
    } else {
      setAnimating(false);
    }
  });

  const animatedStyle = usePulldownLoadingAnimation();

  return (
    <Animated.View style={[styles.loadingrDownContainer, animatedStyle]}>
      <Loading animating={animating} />
    </Animated.View>
  );
};

export const PullupLoading = () => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [animating, setAnimating] = useState<boolean>(false);
  useOnPullupState((state: PullingRefreshStatus) => {
    if (
      [
        PullingRefreshStatus.LOADING,
        PullingRefreshStatus.PULLINGGO,
        PullingRefreshStatus.PULLINGBACK,
      ].includes(state)
    ) {
      setAnimating(true);
    } else {
      setAnimating(false);
    }
  });

  const animatedStyle = usePullupLoadingAnimation();

  return (
    <Animated.View style={[styles.loadingrUpContainer, animatedStyle]}>
      <Loading animating={animating} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loadingrDownContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    top: 0,
  },
  loadingrUpContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom: 0,
    height: 100,
  },
  ml8: {
    marginLeft: 8,
  },
});
