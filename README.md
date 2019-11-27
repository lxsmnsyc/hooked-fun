# hooked-fun
React-like hooks for functions

## What is hooked-fun
`hooked-fun` is a JavaScript library that allows the use of React-like hooks for your functions, which turns your plain functions into stateful functions with lifecycles.

## Why?
This is an experiment, so why not?

Jokes aside, the aim was to keep the functions' purity and the reliance to global references: having persisting references inside the function while also maintaining its scope.

It also aims for easily handling disposal/cleanup logic such as cancelling subscriptions, removing listeners, clearing up data, etc.
