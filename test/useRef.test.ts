import hooked, { useTimeout } from '../src';

const wrapped = hooked((message: string) => {
  useTimeout(() =>{
    console.log(message);
  
    return null;
  }, 1000,[message]);
});

wrapped('Hello');
wrapped('Hello World');
wrapped('Hello');
wrapped('Hello');