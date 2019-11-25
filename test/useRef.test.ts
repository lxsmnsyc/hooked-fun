import hooked, { useMemo } from '../src';

const wrapped = hooked(() => {
  const expensive = useMemo(() => Math.random(), []);

  return expensive;
})

console.log(wrapped());
console.log(wrapped());
console.log(wrapped());
console.log(wrapped());