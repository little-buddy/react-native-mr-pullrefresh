import { createContext } from 'react';
import type { SharedValue } from 'react-native-reanimated';

import type { PullingRefreshStatus } from './constants';

interface MrPullRefreshContextValue {
  pulldownState: SharedValue<PullingRefreshStatus>;
  pullupState: SharedValue<PullingRefreshStatus>;
  panTranlateY: SharedValue<number>;
  scrollerOffsetY: SharedValue<number>;
  contentY: SharedValue<number>;
  containerY: SharedValue<number>;
  pulldownHeight: number;
  pullupHeight: number;
}

export const MrPullRefreshContext =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  createContext<MrPullRefreshContextValue>(null);
