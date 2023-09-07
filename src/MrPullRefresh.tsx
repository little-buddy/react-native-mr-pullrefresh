import React, { memo, type PropsWithChildren, useCallback } from 'react';
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  ViewStyle,
} from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  runOnUI,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import {
  BackFactor,
  FnNull,
  LogFlag,
  PullingRefreshStatus,
  SystemOffset,
} from './constants';
import { MrPullRefreshContext } from './context';
import { PullupLoading } from './DefaultLoading';
import { HeroLottie } from './LottieLoading';
import {
  checkChildren,
  getWindowHeight,
  isPromise,
  withAnimation,
} from './utils';
interface MrRefreshWrapperProps {
  onPulldownRefresh?: () => void | Promise<unknown>;
  onPullupRefresh?: () => void | Promise<unknown>;
  pulldownHeight?: number;
  pullupHeight?: number;
  pulldownLoading?: JSX.Element;
  pullupLoading?: JSX.Element;
  enablePullup?: boolean;
  style?: ViewStyle;
}

const MrRefreshWrapper: React.FC<PropsWithChildren<MrRefreshWrapperProps>> = ({
  onPulldownRefresh = FnNull,
  onPullupRefresh = FnNull,
  pulldownHeight = 140,
  pullupHeight = 100,
  pulldownLoading = <HeroLottie />,
  pullupLoading = <PullupLoading />,
  enablePullup = true /* TODO: will re-render */,
  style,
  children,
}) => {
  // TODO: will check it.
  const windowHeight = getWindowHeight();

  // custom
  const pulldownState = useSharedValue<PullingRefreshStatus>(
    PullingRefreshStatus.IDLE
  );
  const pullupState = useSharedValue<PullingRefreshStatus>(
    PullingRefreshStatus.IDLE
  );
  const containerY = useSharedValue(0);
  const contentY = useSharedValue(0);
  const scrollerOffsetY = useSharedValue(0);
  const panTranslateY = useSharedValue(0);

  // TODO: By ClassComponent ?
  const onPulldownLoading = async () => {
    const res = onPulldownRefresh();

    if (isPromise(res)) {
      await res;
    }

    runOnUI(() => {
      pulldownState.value = PullingRefreshStatus.BACKUP;
      panTranslateY.value = withAnimation(0, () => {
        pulldownState.value = PullingRefreshStatus.IDLE;
      });
    })();
  };

  const onPullupLoading = async () => {
    const res = onPullupRefresh() as unknown;

    if (isPromise(res)) {
      await res;
    }

    runOnUI(() => {
      pullupState.value = PullingRefreshStatus.BACKUP;
      panTranslateY.value = withAnimation(0, () => {
        pullupState.value = PullingRefreshStatus.IDLE;
      });
    })();
  };

  const canPulldown = useDerivedValue(
    () => scrollerOffsetY.value <= SystemOffset
  );

  // TODO: whether need Math.floor
  const canPullup = useDerivedValue(
    () =>
      scrollerOffsetY.value - (contentY.value - containerY.value) >= 0 &&
      enablePullup,
    [enablePullup]
  );

  // TODO: There is time deviation when switching between two elements,
  //       which makes it difficult to judge the critical condition,
  //       it looks unusually unstable
  const native = Gesture.Native();
  const panGesture = Gesture.Pan()
    .onStart(event => {
      if (
        canPulldown.value &&
        pulldownState.value === PullingRefreshStatus.IDLE &&
        event.velocityY > 0
      ) {
        pulldownState.value = PullingRefreshStatus.PULLING;
      }

      if (
        canPullup.value &&
        pullupState.value === PullingRefreshStatus.IDLE &&
        event.velocityY < 0
      ) {
        pullupState.value = PullingRefreshStatus.PULLING;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/no-unnecessary-condition, no-console
      LogFlag && console.log('onStart', pulldownState.value, pullupState.value);
    })
    .onChange(event => {
      if (canPullup.value) {
        if (event.translationY >= 0) {
          pullupState.value = PullingRefreshStatus.IDLE;
        } else {
          pullupState.value =
            -event.translationY > pullupHeight
              ? PullingRefreshStatus.PULLINGGO
              : PullingRefreshStatus.PULLING;
        }
      }

      if (canPulldown.value) {
        if (event.translationY >= 0) {
          pulldownState.value =
            event.translationY > pulldownHeight
              ? PullingRefreshStatus.PULLINGGO
              : PullingRefreshStatus.PULLING;
        } else {
          pulldownState.value = PullingRefreshStatus.IDLE;
        }
      }

      // Note: You will find that there is a scrolling correction bias here
      if (
        ([
          PullingRefreshStatus.PULLING,
          PullingRefreshStatus.PULLINGGO,
        ].includes(pulldownState.value) &&
          canPulldown.value) ||
        ([
          PullingRefreshStatus.PULLING,
          PullingRefreshStatus.PULLINGGO,
        ].includes(pullupState.value) &&
          canPullup.value)
      ) {
        panTranslateY.value = event.translationY;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/no-unnecessary-condition
      LogFlag &&
        // eslint-disable-next-line no-console
        console.log(
          scrollerOffsetY.value,
          contentY.value - containerY.value,
          contentY.value,
          containerY.value,
          scrollerOffsetY.value - (contentY.value - containerY.value)
        );

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/no-unnecessary-condition
      LogFlag &&
        // eslint-disable-next-line no-console
        console.log('onChange', pulldownState.value, pullupState.value);
    })
    .onEnd(() => {
      if (canPulldown.value) {
        if (pulldownState.value !== PullingRefreshStatus.IDLE) {
          pulldownState.value =
            panTranslateY.value >= pulldownHeight
              ? PullingRefreshStatus.PULLINGBACK
              : PullingRefreshStatus.BACKUP;

          if (pulldownState.value === PullingRefreshStatus.BACKUP) {
            panTranslateY.value = withAnimation(0, () => {
              pulldownState.value = PullingRefreshStatus.IDLE;
            });
          }

          if (pulldownState.value === PullingRefreshStatus.PULLINGBACK) {
            panTranslateY.value = withAnimation(pulldownHeight, () => {
              pulldownState.value = PullingRefreshStatus.LOADING;
              runOnJS(onPulldownLoading)();
            });
          }
        }
      }

      if (canPullup.value) {
        if (pullupState.value !== PullingRefreshStatus.IDLE) {
          pullupState.value =
            -panTranslateY.value >= pullupHeight
              ? PullingRefreshStatus.PULLINGBACK
              : PullingRefreshStatus.BACKUP;

          if (pullupState.value === PullingRefreshStatus.BACKUP) {
            panTranslateY.value = withAnimation(0, () => {
              pullupState.value = PullingRefreshStatus.IDLE;
            });
          }

          if (pullupState.value === PullingRefreshStatus.PULLINGBACK) {
            panTranslateY.value = withAnimation(-pullupHeight, () => {
              pullupState.value = PullingRefreshStatus.LOADING;
              runOnJS(onPullupLoading)();
            });
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/no-unnecessary-condition, no-console
      LogFlag && console.log('onEnd', pulldownState.value, pullupState.value);
    });

  const contentAnimation = useAnimatedStyle(() => {
    const isPulldown = pulldownState.value !== PullingRefreshStatus.IDLE;
    let input = [0, pulldownHeight, windowHeight];
    let output = [0, pulldownHeight, pulldownHeight * BackFactor];

    if (!isPulldown) {
      input = [-windowHeight, -pullupHeight, 0];
      output = [-pullupHeight * BackFactor, -pullupHeight, 0];
    }

    return {
      pointerEvents: [pulldownState.value, pullupState.value].includes(
        PullingRefreshStatus.LOADING
      )
        ? 'none'
        : 'auto',
      transform: [
        {
          translateY: interpolate(
            panTranslateY.value,
            input,
            output,
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const childrenWrapperStyle = useAnimatedStyle(() => ({
    pointerEvents:
      pullupState.value !== PullingRefreshStatus.IDLE ||
      pulldownState.value !== PullingRefreshStatus.IDLE
        ? 'none'
        : 'auto',
  }));

  const onScroll = useAnimatedScrollHandler((event: NativeScrollEvent) => {
    const y = event.contentOffset.y;
    // console.log(event.contentOffset, event.contentInset);
    scrollerOffsetY.value = y;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (children.onScroll) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      runOnJS(children.onScroll)(event);
    }
  });

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      containerY.value = event.nativeEvent.layout.height;
    },
    [containerY]
  );

  const onContentSizeChange = useCallback(
    (_width: number, height: number) => {
      contentY.value = height;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (children.onContentSizeChange) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        children.onContentSizeChange(event);
      }
    },
    [contentY, children]
  );

  return (
    <MrPullRefreshContext.Provider
      value={{
        pulldownState,
        pullupState,
        panTranslateY,
        scrollerOffsetY,
        contentY,
        containerY,
        pulldownHeight,
        pullupHeight,
      }}
    >
      <View style={[styles.flex, styles.overhidden, style]}>
        {pulldownLoading}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            onLayout={onLayout}
            style={[styles.flex, styles.zTop, contentAnimation]}
          >
            <GestureDetector gesture={Gesture.Simultaneous(panGesture, native)}>
              {React.cloneElement(
                checkChildren(children as React.ReactElement),
                {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  onContentSizeChange,
                  onScroll,
                  bounces: false,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  style: [children?.props?.style, childrenWrapperStyle],
                }
              )}
            </GestureDetector>
          </Animated.View>
        </GestureDetector>
        {enablePullup && pullupLoading}
      </View>
    </MrPullRefreshContext.Provider>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  zTop: {
    zIndex: 2,
  },
  overhidden: {
    overflow: 'hidden',
  },
});

export const MrPullRefresh = memo(MrRefreshWrapper);
