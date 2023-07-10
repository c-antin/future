# Future
TypeScript: Minimalistic lazy Promise aka Future

`Future` extends `Promise` and is only executed when awaited.
Can be awaited multiple times.

## Example

```ts
import { Future } from "https://deno.land/x/future@v1.0.0/mod.ts";

let n = 0;
const future = new Future<number>((resolve) => {
    n++;
    console.log("executor", n);
    resolve(n);
});
console.log(future); // prints `Future [Promise] { <pending> }`
console.assert(n === 0);

{
    const m = await future; // prints `executor 1`
    console.assert(m === 1);
}
console.log(future); // prints `Future [Promise] { <pending> }`
console.assert(n === 1);

{
    const m = await future; // prints `executor 2`
    console.assert(m === 2);
}
console.log(future); // prints `Future [Promise] { <pending> }`
console.assert(n === 2);

```
