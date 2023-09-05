import React from 'react';
import { Text, View } from 'react-native';
import { useAnimatedReaction } from 'react-native-reanimated';

import { FnNull } from './constants';
import { useMrPullRefreshValue } from './hooks';

interface InlineLoadMoreProps {
  onLoadMore: typeof FnNull;
}

export const InlineLoadMore: React.FC<InlineLoadMoreProps> = ({
  onLoadMore = FnNull,
}) => {
  const ctx = useMrPullRefreshValue();

  useAnimatedReaction(
    () => ctx.scrollerOffsetY.value,
    (current, prev) => {
      if (current !== prev) {
        // TODO: 防抖
        onLoadMore();
      }
    }
  );

  return (
    <View>
      <Text>LoadMore</Text>
    </View>
  );
};
