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
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { FnNull, iOSpringConfig, PullingRefreshStatus } from './constants';
import { MrPullRefreshContext } from './context';
import { PullupLoading } from './DefaultLoading';
import { HeroLottie } from './LottieLoading';
import { checkChildren, getWindowHeight, isPromise } from './utils';
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
  enablePullup = true,
  style,
  children,
}) => {
  const windowHeight = getWindowHeight();

  // custom
  const pulldownState = useSharedValue<PullingRefreshStatus>(
    PullingRefreshStatus.IDLE
  );
  const pullupState = useSharedValue<PullingRefreshStatus>(
    PullingRefreshStatus.IDLE
  );
  const panTranslateY = useSharedValue(0);
  const scrollerOffsetY = useSharedValue(0);
  const contentY = useSharedValue(0);
  const containerY = useSharedValue(0);

  const onPulldownLoading = async () => {
    const res = onPulldownRefresh();

    if (isPromise(res)) {
      await res;
    }

    runOnUI(() => {
      pulldownState.value = PullingRefreshStatus.BACKUP;
      panTranslateY.value = withSpring(
        0,
        iOSpringConfig,
        (finished?: boolean) => {
          if (finished) {
            pulldownState.value = PullingRefreshStatus.IDLE;
          }
        }
      );
    })();
  };

  const onPullupLoading = async () => {
    const res = onPullupRefresh() as unknown;

    if (isPromise(res)) {
      await res;
    }

    runOnUI(() => {
      pullupState.value = PullingRefreshStatus.BACKUP;
      panTranslateY.value = withSpring(
        0,
        iOSpringConfig,
        (finished?: boolean) => {
          if (finished) {
            pullupState.value = PullingRefreshStatus.IDLE;
          }
        }
      );
    })();
  };

  // TODO: 还是这个问题，2个元素区域切换的时候存在时间偏差，导致不好判断临界条件
  //       就显得异常不稳定
  const native = Gesture.Native();
  const panGesture = Gesture.Pan()
    .onStart(() => {
      if (pulldownState.value === PullingRefreshStatus.IDLE) {
        pulldownState.value = PullingRefreshStatus.PULLING;
      }

      if (pullupState.value === PullingRefreshStatus.IDLE && enablePullup) {
        pullupState.value = PullingRefreshStatus.PULLING;
      }
    })
    .onChange(event => {
      // TODO: 回拉的时候还需要判断处理

      // TODO: chang
      // console.log(event.translationY);

      if (enablePullup) {
        if (event.translationY >= 0) {
          pullupState.value = PullingRefreshStatus.IDLE;
        } else {
          pullupState.value =
            -event.translationY > pullupHeight
              ? PullingRefreshStatus.PULLINGGO
              : PullingRefreshStatus.PULLING;
        }
      }

      if (event.translationY >= 0) {
        pulldownState.value =
          event.translationY > pulldownHeight
            ? PullingRefreshStatus.PULLINGGO
            : PullingRefreshStatus.PULLING;
      } else {
        pulldownState.value = PullingRefreshStatus.IDLE;
      }

      console.log(
        'debug',
        scrollerOffsetY.value,
        contentY.value - containerY.value
      );

      // TODO: 而且你会发现它这里其实是有修正偏差的
      if (
        ([
          PullingRefreshStatus.PULLING,
          PullingRefreshStatus.PULLINGGO,
        ].includes(pulldownState.value) &&
          scrollerOffsetY.value < 10) ||
        ([
          PullingRefreshStatus.PULLING,
          PullingRefreshStatus.PULLINGGO,
        ].includes(pullupState.value) &&
          Math.floor(contentY.value - containerY.value) -
            Math.floor(scrollerOffsetY.value) <
            10 &&
          enablePullup)
      ) {
        // console.log('change panTranslate',,);
        panTranslateY.value = event.translationY;
      }
    })
    .onEnd(() => {
      if (pulldownState.value !== PullingRefreshStatus.IDLE) {
        pulldownState.value =
          panTranslateY.value >= pulldownHeight
            ? PullingRefreshStatus.PULLINGBACK
            : PullingRefreshStatus.BACKUP;

        // console.log(refreshState.current,moveY.value,refreshHeight)
        if (pulldownState.value === PullingRefreshStatus.BACKUP) {
          panTranslateY.value = withSpring(0, iOSpringConfig, finished => {
            if (finished) {
              pulldownState.value = PullingRefreshStatus.IDLE;
            }
          });
        }

        if (pulldownState.value === PullingRefreshStatus.PULLINGBACK) {
          panTranslateY.value = withSpring(
            pulldownHeight,
            iOSpringConfig,
            finished => {
              if (finished) {
                pulldownState.value = PullingRefreshStatus.LOADING;
                runOnJS(onPulldownLoading)();
              }
            }
          );
        }
      }

      if (pullupState.value !== PullingRefreshStatus.IDLE && enablePullup) {
        pullupState.value =
          -panTranslateY.value >= pullupHeight
            ? PullingRefreshStatus.PULLINGBACK
            : PullingRefreshStatus.BACKUP;

        // console.log(refreshState.current,moveY.value,refreshHeight)
        if (pullupState.value === PullingRefreshStatus.BACKUP) {
          panTranslateY.value = withSpring(0, iOSpringConfig, finished => {
            if (finished) {
              pullupState.value = PullingRefreshStatus.IDLE;
            }
          });
        }

        if (pullupState.value === PullingRefreshStatus.PULLINGBACK) {
          panTranslateY.value = withSpring(
            -pullupHeight,
            iOSpringConfig,
            finished => {
              if (finished) {
                pullupState.value = PullingRefreshStatus.LOADING;
                runOnJS(onPullupLoading)();
              }
            }
          );
        }
      }
    });

  const contentAnimation = useAnimatedStyle(() => {
    const isPulldown = pulldownState.value !== PullingRefreshStatus.IDLE;
    let input: [number, number, number] = [0, pulldownHeight, windowHeight];
    let output: [number, number, number] = [
      0,
      pulldownHeight,
      pulldownHeight * 3,
    ];

    if (!isPulldown) {
      input = [-windowHeight, -pullupHeight, 0];
      output = [-pullupHeight * 3, -pullupHeight, 0];
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

  const onScroll = useAnimatedScrollHandler((event: NativeScrollEvent) => {
    const y = event.contentOffset.y;
    console.log(event.contentOffset, event.contentInset);
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
  loaderContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export const MrPullRefresh = memo(MrRefreshWrapper);
