export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

export const enterTransition = {
  duration: 0.26,
  ease: EASE_OUT,
};

export function enterFromBelow(reducedMotion: boolean, distance = 8) {
  return {
    initial: {
      opacity: 0,
      transform: reducedMotion ? 'none' : `translateY(${distance}px)`,
    },
    animate: {
      opacity: 1,
      transform: 'translateY(0)',
    },
    transition: enterTransition,
  };
}

export function disclosureMotion(reducedMotion: boolean, direction: 'up' | 'down' = 'up') {
  const offset = direction === 'up' ? -4 : 4;
  const hiddenTransform = reducedMotion ? 'none' : `translateY(${offset}px) scale(0.985)`;

  return {
    initial: { opacity: 0, transform: hiddenTransform },
    animate: { opacity: 1, transform: 'translateY(0) scale(1)' },
    exit: { opacity: 0, transform: hiddenTransform },
  };
}
