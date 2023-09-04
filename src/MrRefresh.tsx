import React, { memo, type PropsWithChildren } from 'react';
import type { NativeScrollEvent, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { type HitSlop } from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlerCommon';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  runOnUI,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { FnNull, PullingRefreshStatus } from './constants';
import DefaultLoader from './Loader';
import { getWindowHeight, isPromise } from './utils';
interface MrRefreshWrapperProps {
  onPulldownRefresh?: () => void | Promise<unknown>;
  onPullupRefresh?: () => void | Promise<unknown>;
  pulldownHeight?: number;
  pullupHeight?: number;
  Loader?: () => JSX.Element | JSX.Element;
  bounces?: Blob;
  hitSlop?: HitSlop;
  style?: ViewStyle;
  scroller?: JSX.Element;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollProps: any;
}

const MrRefreshWrapper: React.FC<PropsWithChildren<MrRefreshWrapperProps>> = ({
  onPulldownRefresh = FnNull,
  onPullupRefresh = FnNull,
  pulldownHeight = 100,
  pullupHeight = 100,
  children = null,
  Loader = <DefaultLoader />,

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bounces = false,
  hitSlop,
  style,
  scroller = Animated.ScrollView,
  scrollProps = {},
}) => {
  const windowHeight = getWindowHeight();

  // custom
  const pulldownState = useSharedValue<PullingRefreshStatus>(
    PullingRefreshStatus.IDLE
  );
  const pullupState = useSharedValue<PullingRefreshStatus>(
    PullingRefreshStatus.IDLE
  );
  const panTranlateY = useSharedValue(0);
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
      panTranlateY.value = withTiming(0, undefined, (finished?: boolean) => {
        if (finished) {
          pulldownState.value = PullingRefreshStatus.IDLE;
        }
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
      panTranlateY.value = withTiming(0, undefined, (finished?: boolean) => {
        if (finished) {
          pullupState.value = PullingRefreshStatus.IDLE;
        }
      });
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

      if (pullupState.value === PullingRefreshStatus.IDLE) {
        pullupState.value = PullingRefreshStatus.PULLING;
      }
    })
    .onChange(event => {
      console.log(pullupState.value, pulldownState.value);

      if (event.translationY >= 0) {
        pullupState.value = PullingRefreshStatus.IDLE;
        pulldownState.value = PullingRefreshStatus.PULLING;
      } else {
        pulldownState.value = PullingRefreshStatus.IDLE;
        pullupState.value = PullingRefreshStatus.PULLING;
      }

      console.log(scrollerOffsetY.value, contentY.value - containerY.value);

      // TODO: 不需要判断元素见底，因为元素见底，触摸状态就会交给上一层级
      // TODO: 而且你会发现它这里其实是有修正偏差的
      if (
        (pulldownState.value === PullingRefreshStatus.PULLING &&
          scrollerOffsetY.value < 10) ||
        (pullupState.value === PullingRefreshStatus.PULLING &&
          Math.floor(contentY.value - containerY.value) -
            Math.floor(scrollerOffsetY.value) <
            10)
      ) {
        panTranlateY.value = event.translationY;
      }
    })
    .onEnd(() => {
      if (pulldownState.value !== PullingRefreshStatus.IDLE) {
        pulldownState.value =
          panTranlateY.value >= pulldownHeight
            ? PullingRefreshStatus.PULLINGBACK
            : PullingRefreshStatus.BACKUP;

        // console.log(refreshState.current,moveY.value,refreshHeight)
        if (pulldownState.value === PullingRefreshStatus.BACKUP) {
          panTranlateY.value = withTiming(0, undefined, finished => {
            if (finished) {
              pulldownState.value = PullingRefreshStatus.IDLE;
            }
          });
        }

        if (pulldownState.value === PullingRefreshStatus.PULLINGBACK) {
          panTranlateY.value = withTiming(
            pulldownHeight,
            undefined,
            finished => {
              if (finished) {
                pulldownState.value = PullingRefreshStatus.LOADING;
                runOnJS(onPulldownLoading)();
              }
            }
          );
        }
      }

      if (pullupState.value !== PullingRefreshStatus.IDLE) {
        pullupState.value =
          -panTranlateY.value >= pullupHeight
            ? PullingRefreshStatus.PULLINGBACK
            : PullingRefreshStatus.BACKUP;

        // console.log(refreshState.current,moveY.value,refreshHeight)
        if (pullupState.value === PullingRefreshStatus.BACKUP) {
          panTranlateY.value = withTiming(0, undefined, finished => {
            if (finished) {
              pullupState.value = PullingRefreshStatus.IDLE;
            }
          });
        }

        if (pullupState.value === PullingRefreshStatus.PULLINGBACK) {
          panTranlateY.value = withTiming(
            -pullupHeight,
            undefined,
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

  if (hitSlop !== undefined) {
    panGesture.hitSlop(hitSlop);
  }

  const pulldownLoadingAnimation = useAnimatedStyle(() => ({
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

  const pullupLoadingAnimation = useAnimatedStyle(() => ({
    height: pullupHeight,
    opacity: interpolate(-panTranlateY.value, [0, pullupHeight], [0, 1]),
    translateY: interpolate(
      -panTranlateY.value,
      [0, pullupHeight, windowHeight],
      [pullupHeight, 0, 0]
    ),
  }));

  const contentAnimation = useAnimatedStyle(() => {
    const isPulldown = pulldownState.value !== PullingRefreshStatus.IDLE;

    let input = [0, pulldownHeight, windowHeight];
    let output = [0, pulldownHeight, pulldownHeight * 1.2];

    if (!isPulldown) {
      input = [windowHeight, -pullupHeight, 0];
      output = [-pullupHeight * 1.2, -pullupHeight, 0];
    }

    return {
      transform: [
        {
          translateY: interpolate(
            panTranlateY.value,
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

    if (scrollProps.onScroll) {
      runOnJS(scrollProps.onScroll)(event);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Scroller: any = scroller;

  return (
    <View style={[styles.flex, style]}>
      <Animated.View style={[styles.loaderContainer, pulldownLoadingAnimation]}>
        {typeof Loader === 'function' ? <Loader /> : Loader}
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          onLayout={event => {
            containerY.value = event.nativeEvent.layout.height;
          }}
          style={[styles.flex, contentAnimation]}
        >
          <GestureDetector gesture={Gesture.Simultaneous(panGesture, native)}>
            <Scroller
              {...scrollProps}
              onScroll={onScroll}
              onContentSizeChange={(width: number, height: number) => {
                contentY.value = height;
              }}
            >
              {children}
            </Scroller>
          </GestureDetector>
        </Animated.View>
      </GestureDetector>

      <Animated.View
        style={[styles.loaderContainer, pullupLoadingAnimation, { bottom: 0 }]}
      >
        {typeof Loader === 'function' ? <Loader /> : Loader}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  loaderContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export const MrRefresh = memo(MrRefreshWrapper);
