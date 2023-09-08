export enum PullingRefreshStatus {
  IDLE,
  PULLING,
  PULLINGGO,
  PULLINGBACK,
  LOADING,
  BACKUP,
}

export const iOSpringConfig = {
  velocity: 0,
  mass: 1,
  damping: 27,
  stiffness: 300,
  overshootClamping: true,
  // duration: 600,
};

export const SystemOffset = 1;

// true -> dev
// eslint-disable-next-line @typescript-eslint/naming-convention
export const LogFlag = false;

export const FnNull = () => {
  /*  */
};
