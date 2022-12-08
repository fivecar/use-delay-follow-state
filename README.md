# use-delay-follow-state

> React hook for setting State with delay

[![NPM](https://img.shields.io/npm/v/use-delay-follow-state.svg)](https://www.npmjs.com/package/use-delay-follow-state) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This is an enhanced `useState` hook which accepts delay for `setState` as an extra argument. In most basic form it works same as React `useState` hook.

This package was derived from `use-delayed-state`, but also implements
`useFollowState`, which gives you both an immediately-updated state along with
one that follows it after a delay.

## Use cases

It can be used for [debouncing](https://css-tricks.com/debouncing-throttling-explained-examples/#article-header-id-0) which simply delays consecuative attempts for setting a state, and if the last call persists for enough time, the actual `setState` runs.

It is also a handy tool for applying timing logics inside React components e.g. showing a notification for few seconds.

## Install

```console
npm install --save use-delay-follow-state
```
or
```console
yarn add use-delay-follow-state
```

## Usage

```jsx
import React from 'react'
import { useDelayedState } from 'use-delay-follow-state'

export default function myComponent() {
  const [state, setState] = useDelayedState(
    'I will disappear in 5 secs'
  );

  setState('I am the new state', 5000);

  return <div>{state}</div>
}
```
In the above example, `state` will be updated after 5 seconds.

[Debouncing example](https://fivecar.github.io/use-delay-follow-state/) is a more advanced implementation of this hook (source code [here](https://github.com/fivecar/use-delay-follow-state/blob/master/example/src/App.js)). It uses the more common scenario, with `useFollowState`, where a controlled
component needs both an immediately-updated state as well as one that has a
delay. For instance:

```jsx
import React, { useState, useEffect } from 'react'
import { useFollowState } from 'use-delay-follow-state'

export default function myComponent() {
  const [typedText, query, setText] = useFollowState("");
  const [queryResult, setQueryResult] = useState("");

  useEffect(()=> {
    async function sendQuery() {
      // Axios is just an example. Any http/get library will do.
      const res = await axios.get("https://allyourbase.com/search?q=" + query);
      if (res.status === 200) {
        setQueryResult(res.data);
      }
    }

    sendQuery();
  }, [query]);  // Query is only updated after a 500ms delay

  return (
    <div>
      <input
        type="text"
        value="typedText"
        onChange={evt => setText(evt.target.value, 500)}
      />
      {`Query result: ${queryResult}`}
    </div>
  );
}
```

## `useDelayedState` Details

```jsx
const [state, setState, cancelSetState] = useDelayedState(initialState);
// works like regular useState hook
// also cancels any ongoing delayed setStates
setState(newState); // or setState(newState, 0)

// setState with delay
// duration unit is milliseconds
// also cancels any previously scheduled delayed setStates
setState(newState, duration);

// cancels any ongoing delayed setState
cancelSetState();

// setState along with setState with delay in one render
// sets state to newState immediately and then and it will set state to
// futureState after 2s
setState(newState);
setState(futureState, 2000);
```

## `useFollowState` Details

```jsx
const [immediate, delayed, setFollowState, revertStateToFollow] =
  useFollowState(initialState);

// immediate will be "montauk" right away, like a regular setState.
// delayed will remain initialState for 500ms, then become "montauk" as well.
// Useful for cases where UI needs to show a change right away, but some
// background process, like a cloud call, needs to debounce/delay a bit.
setFollowState("montauk", 500);

// Several seconds later, you want to set a new state...
setFollowState("lisbon", 2000);
// ... but then you decide that you should cancel that, within the
// 2000ms, so that immediate === delayed === "montauk":
revertStateToFollow();
```

## License

MIT © [fivecar](https://github.com/fivecar)
