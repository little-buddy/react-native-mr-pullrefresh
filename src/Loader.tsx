import React, { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
} from 'react-native-reanimated';

import { PullingRefreshStatus } from './constants';

interface LoaderProps {
  loaderState?: SharedValue<PullingRefreshStatus>;
}

const AnimatedActivityIndicator =
  Animated.createAnimatedComponent(ActivityIndicator);

// react-native-reanimated 只能转换 props 属性

export const Loader: React.FC<LoaderProps> = ({ loaderState }) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [animating, setAnimating] = useState<boolean>(false);

  const onChange = (current: PullingRefreshStatus) => {
    if (
      [
        PullingRefreshStatus.LOADING,
        PullingRefreshStatus.PULLINGGO,
        PullingRefreshStatus.PULLINGBACK,
      ].includes(current)
    ) {
      setAnimating(true);
    } else {
      setAnimating(false);
    }
  };

  useAnimatedReaction(
    () => loaderState?.value,
    current => {
      runOnJS(onChange)(current);
    }
  );

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <AnimatedActivityIndicator animating={animating} color="#782aeb" />
      <Text style={{ marginLeft: 8 }}>Loader</Text>
    </View>
  );
};

export default Loader;
