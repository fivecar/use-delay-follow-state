import React, { useState, useEffect } from "react";

import { useDelayedState, useFollowState } from "use-delay-follow-state";

const App = () => {
  const [state, followState, setState] = useFollowState("");
  const [delay, setDelay] = useState(900);
  const [updating, setUpdating] = useDelayedState(false);
  function handleChange(e) {
    setState(e.target.value, delay);
  }

  useEffect(() => {
    setUpdating(true);
    setUpdating(false, 1000);
    // need to not include setUpdating in dep list
    // eslint-disable-next-line
  }, [state]);

  return (
    <div>
      <p className="description">
        In this example State will be updated after debouncing delay. Try it by
        typing in textarea.
      </p>
      <div className="container">
        <div className="form-container">
          <form>
            <h4>Real-time value</h4>

            <textarea
              type="text"
              placeholder="Type something"
              onChange={handleChange}
              value={state}
            />
            <label htmlFor="delay">{`Debouncing delay ${delay}ms`}</label>
            <input
              type="range"
              id="delay"
              name="delay"
              value={delay}
              min={0}
              max={2000}
              step={20}
              onChange={(e) => {
                setDelay(e.target.value);
              }}
            />
          </form>
        </div>
        <div className="form-container">
          <form>
            <h4>Debounced State</h4>
            <p className={updating ? "updating" : ""}>{followState}</p>
          </form>
        </div>
      </div>
      <div className="links">
        <a href="https://github.com/fivecar/use-delay-follow-state/blob/master/example/src/App.js">
          Source code
        </a>
        <a href="https://github.com/fivecar/use-delay-follow-state">
          use-delay-follow-state
        </a>
      </div>
    </div>
  );
};

export default App;
