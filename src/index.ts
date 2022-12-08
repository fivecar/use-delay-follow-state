import { useEffect, useRef, useState } from "react";

/**
 * Enhancement of useState that sets a state after an (optional) delay in
 * milliseconds. Can be canceled with `cancelSetState`.
 * @template T
 * @param {T} initialState - The state you want to start with
 * @returns [state: T, setStateAfter: (newState: T, delayMS?: number) => void, cancelSetState: () => void]
 */
export function useDelayedState<T>(
  initialState: T
): [T, (newState: T, delayMS?: number) => void, () => void] {
  const [state, setState] = useState(initialState);
  const timeoutRef = useRef();

  const cancelSetState = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const setStateAfter = (newState: T, delayMS?: number) => {
    // The implication here is that setStateAfter("hi", 3000) followed shortly
    // by setStateAfter("bye") should cancel the original "hi".
    cancelSetState();

    if (delayMS === 0 || delayMS === undefined) {
      setState(newState);
    } else {
      timeoutRef.current = setTimeout(() => {
        setState(newState);
        timeoutRef.current = null;
      }, delayMS);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return [state, setStateAfter, cancelSetState];
}

/**
 * Hook that gives you both an immediately-set state as well as one that will
 * become that state after a delay. Most commonly used for cases where you have
 * a controlled input box, for instance, and you want to also issue an async
 * query after the user has paused typing for a while.
 *
 * Call `setStateAndFollow` to have state immediately set to a value, with
 * followState to be set to the same value after duration millisecs.
 * `revertStateToFollow` cancels any timers and sets state back to the value
 * that followState currently has.
 *
 * @template T
 * @param {T} initialState - The state you want initially
 * @returns [currentState: T, delayedState: T, setStateAndFollow: (newState: T, delayMS?: number) => void, revertStateToFollow: () => void]
 */
export function useFollowState<T>(
  initialState: T
): [T, T, (newState: T, delayMS?: number) => void, () => void] {
  const [state, setState] = useState(initialState);
  const [followState, setFollowState, cancelFollowState] =
    useDelayedState(initialState);

  const setStateAndFollow = (newState: T, delayMS?: number) => {
    setState(newState);
    setFollowState(newState, delayMS);
  };

  // This is meant for cases where you've set a state with a delay, but you've
  // now changed your mind and would like to undo that within the delay window.
  const revertStateToFollow = () => {
    cancelFollowState();
    if (state !== followState) {
      setState(followState);
    }
  };

  return [state, followState, setStateAndFollow, revertStateToFollow];
}
