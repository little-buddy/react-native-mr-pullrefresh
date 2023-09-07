//

export enum PullingRefreshStatus {
  IDLE,
  PULLING,
  PULLINGGO,
  PULLINGBACK,
  LOADING,
  BACKUP,
}

export const iOSpringConfig = {
  velocity: 8,
  mass: 1,
  damping: 15,
  stiffness: 100,
  overshootClamping: true,
};

export const SystemOffset = 5;

export const BackFactor = 3;

// true -> dev
// eslint-disable-next-line @typescript-eslint/naming-convention
export const LogFlag = false;

export const FnNull = () => {
  /*  */
};
