import { assertEquals } from "https://deno.land/std@0.193.0/testing/asserts.ts";
import { Future } from "./mod.ts";

Deno.test("Future", async () => {
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

Deno.test("Deno.inspect", async () => {
  const future = new Future<null>((resolve) => {
    resolve(null);
  });

  assertEquals(Deno.inspect(future), "Future [Promise] { <pending> }");

  await future;
  assertEquals(Deno.inspect(future), "Future [Promise] { <pending> }");
});
