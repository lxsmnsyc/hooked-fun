import hooked, { useState } from '../src';

const wrappedEx = hooked(() => {
  const [count, setCount] = useState(0);

  if (count < 100) {
    setCount(count + 1);
  }

  return count;
});

const wrapped = hooked(() => {
  const [count, setCount] = useState(0);

  if (count < 100) {
    setCount(count + 1);
  }

  return [count, wrappedEx()];
});

console.log(wrapped());
console.log(wrapped());
console.log(wrapped());
console.log(wrapped());