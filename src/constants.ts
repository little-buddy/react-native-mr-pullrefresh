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
};

export const FnNull = () => {
  /*  */
};
