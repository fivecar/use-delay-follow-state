import { useEffect, useState, useRef } from "react";

/**
 * Enhancement of useState that sets a state after an (optional) delay in
 * milliseconds. Can be canceled with `cancelSetState`.
 * @param {any} initialState - The state you want to start with
 * @returns {[any, (any, number) => void, () => void]} [state, setStateAfter, cancelSetState]
 */
export function useDelayedState(initialState) {
  const [state, setState] = useState(initialState);
  const timeoutRef = useRef();

  const cancelSetState = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const setStateAfter = (newState, delay) => {
    // The implication here is that setStateAfter("hi", 3000) followed shortly
    // by setStateAfter("bye") should cancel the original "hi".
    cancelSetState();

    if (delay === 0 || delay === undefined) {
      setState(newState);
    } else {
      timeoutRef.current = setTimeout(() => {
        setState(newState);
        timeoutRef.current = null;
      }, delay);
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
 * @param {any} initialState - The state that
 * @returns {[any, any, (any, number) => void, ()=>void]} currentState, delayedState, setState, and revert function
 */
export function useFollowState(initialState) {
  const [state, setState] = useState(initialState);
  const [followState, setFollowState, cancelFollowState] =
    useDelayedState(initialState);

  const setStateAndFollow = (newState, delay) => {
    setState(newState);
    setFollowState(newState, delay);
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
