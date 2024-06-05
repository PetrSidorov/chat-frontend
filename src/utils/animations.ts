export const animations: Tanimations = {
  disableAnimation: {
    initial: undefined,
    animate: undefined,
    transition: undefined,
  },
  enter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 },
  },
  editMessage: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 },
  },
  remove: {
    initial: { x: 0, opacity: 1 },
    animate: { x: 0, opacity: 1 },
    exit: {
      x: 300,
      opacity: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  },
  convoSwitch: {
    initial: { x: 0, opacity: 1 },
    animate: { x: 0, opacity: 1 },
    exit: {
      x: -300,
      opacity: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  },
};

type Tanimations = {
  [key: string]: {
    initial: { opacity: number; y?: number; x?: number } | undefined;
    animate: { opacity: number; y?: number; x?: number } | undefined;
    exit?: {
      opacity: number;
      y?: number;
      x?: number;
      transition?: { duration: number; ease?: string };
    };
    transition?: { duration: number; ease?: string } | undefined;
  };
};
