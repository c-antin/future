import { assertEquals } from "https://deno.land/std@0.193.0/testing/asserts.ts";
import { Future } from "./mod.ts";

Deno.test("promise", async () => {
  let n = 0;
  //promise runs immediately
  const promise = new Promise<number>((resolve) => {
    n++;
    console.log("executor", n);
    resolve(n);
  });
  console.log(promise);
  assertEquals(n, 1);

  {
    const m = await promise;
    assertEquals(m, 1);
  }
  console.log(promise);
  assertEquals(n, 1);
});

Deno.test("await", async () => {
  let n = 0;
  const future = new Future<number>((resolve) => {
    n++;
    console.log("executor", n);
    resolve(n);
  });
  console.log(future);
  assertEquals(n, 0);

  {
    const m = await future;
    assertEquals(m, 1);
  }
  console.log(future);
  assertEquals(n, 1);

  {
    const m = await future;
    assertEquals(m, 2);
  }
  console.log(future);
  assertEquals(n, 2);

  {
    const m = await future;
    assertEquals(m, 3);
  }
  console.log(future);
  assertEquals(n, 3);
});

Deno.test("all", async () => {
  let n = 0;
  const future = new Future<number>((resolve) => {
    n++;
    console.log("executor", n);
    resolve(n);
  });
  console.log(future);
  assertEquals(n, 0);

  const [m1, m2, m3] = await Promise.all([
    future,
    future,
    future,
  ]);
  assertEquals(m1 + m2 + m3, 1 + 2 + 3);
  assertEquals(n, 3);
});

Deno.test("then", () => {
  let n = 0;
  const future = new Future<number>((resolve) => {
    n++;
    console.log("executor", n);
    resolve(n);
  });
  //chaining does not execute twice, because `then` returns new Promise
  future.then((value) => value).then((value) => {
    assertEquals(value, 1);
  });
  //whereas this does execute again
  future.then((value) => {
    assertEquals(value, 2);
  });
});

Deno.test("catch", () => {
  let n = 0;
  const future = new Future<number>((resolve) => {
    n++;
    console.log("executor", n);
    resolve(n);
  });
  //`catch` does execute
  future.catch((value) => {
    assertEquals(value, 1);
  });
});

Deno.test("finally", () => {
  let n = 0;
  const future = new Future<number>((resolve) => {
    n++;
    console.log("executor", n);
    resolve(n);
  });
  //`finally` does execute
  future.finally(() => {
    assertEquals(n, 1);
  });
});

Deno.test("inspect", async () => {
  const future = new Future<null>((resolve) => {
    resolve(null);
  });

  assertEquals(Deno.inspect(future), "Future [Promise] { <pending> }");

  await future;
  assertEquals(Deno.inspect(future), "Future [Promise] { <pending> }");
});
