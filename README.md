# hooked-fun
React-like hooks for functions

## What is hooked-fun
`hooked-fun` is a JavaScript library that allows the use of React-like hooks for your functions, which turns your plain functions into stateful functions with lifecycles.

## Why?
This is an experiment, so why not?

Jokes aside, the aim was to keep the functions' purity and the reliance to global references: having persisting references inside the function while also maintaining its scope.

It also aims for easily handling disposal/cleanup logic such as cancelling subscriptions, removing listeners, clearing up data, etc.

## What's the difference?
`hooked-fun`, unlike React hooks, do not have reactive hooks, which doesn't allow the function to 'call itself'. The reason behind this is that the state tree can be easily ruined with asynchronously scheduled calls for recalling the function, as well as it counters the supposed behavior of a function.

## List of hooks

- `useAnimationFrame`: registers an animation frame side-effect.
- `useCleanup`: registers a cleanup callback when the `cleanup` method is called.
- `useConstant`: memoize a supplied value from a function.
- `useDebounce`: debounces a side-effect until a given duration, executing it.
- `useEffect`: a side-effect that runs after the hooked function's call ends.
- `useInitial`: a side-effect that runs once after the hooked function's call ends.
- `useInterval`: registers an interval side-effect.
- `useLiveState`: a reference that contains the boolean state of the hook's lifecycle.
- `useMemo`: a hook similar to `useConstant` except that it recalculates when the dependencies change.
- `usePrevious`: keeps the previous value from the previous call.
- `usePromise`: returns a callback that wraps a Promise which does not resolve if the hooked function's `cleanup` method is called.
- `useRef`: a persistent mutable reference that lives throughout the hooked functions' lifecycle.
- `useSyncEffect`: like `useEffect`, a side-effect that executes synchronously.
- `useSyncInitial`: like `useInitial`, a side-effect that executes synchronously once.
- `useThrottle`: executes a side-effect and runs a cooldown timer that keeps it from executing again.
- `useTimeout`: registers a timeout side-effect.