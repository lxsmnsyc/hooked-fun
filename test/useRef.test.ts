import hooked, { useEffect } from '../src';

function effectExample(message: string) {
  console.log(message);

  return null;
}

const wrapped = hooked((message: string) => {
  useEffect(effectExample, [message]);
});

wrapped('Hello');
wrapped('Hello World');
wrapped('Hello');
wrapped('Hello');