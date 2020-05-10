# use-delayed-state

> React hook for setting State with delay

[![NPM](https://img.shields.io/npm/v/use-delayed-state.svg)](https://www.npmjs.com/package/use-delayed-state) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This is an enhanced `useState` hook which accepts delay for `setState` as an extra argument.

## Use cases

It is usefull feature for [debouncing](https://css-tricks.com/debouncing-throttling-explained-examples/#article-header-id-0) which simply delays all consecuative attempts for setting a state to make sure only the last one which persists for certain amount of time is valid as new state.

It is also a handy tool for applying timing logics inside react components e.g. Showing a notification for few seconds.




## Install

```bash
npm install --save use-delayed-state
```

## Usage

```jsx
import React from 'react'
import useDelayedState from 'use-delayed-state'

export default function myComponent() {
  const [state, setState] = useDelayedState(
    'Hello, I will be change in 5 seconds'
  )

  setState('I am new State', 5000)

  return <div>{state}</div>
}
```
In above example `State` will be updated after 5 second.

For more advance usage [debouncing example](https://makannew.github.io/use-delayed-state/) is provided.



## License

MIT © [makannew](https://github.com/makannew)
