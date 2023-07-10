type Executor<T> = ConstructorParameters<typeof Promise<T>>[0];
type ResolveHandler<T> = Parameters<Executor<T>>[0];
type RejectHandler<T> = Parameters<Executor<T>>[1];

export class Future<T> extends Promise<T> {
  static [Symbol.species] = Promise; //required to prevent TypeError: Promise resolve or reject function is not callable

  #resolve;
  #reject;
  #executor;
  #isPending = true;

  constructor(executor: Executor<T>) {
    let resolve: ResolveHandler<T>;
    let reject: RejectHandler<T>;

    super((a: ResolveHandler<T>, b: RejectHandler<T>) => {
      resolve = a;
      reject = b;
    });

    this.#resolve = (value: Parameters<ResolveHandler<T>>[0]) => {
      resolve(value);
    };
    this.#reject = (reason?: Parameters<RejectHandler<T>>[0]) => {
      reject(reason);
    };
    this.#executor = executor;
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined,
  ): Promise<TResult1 | TResult2> {
    if (this.#isPending) {
      this.#isPending = false;
      this.#executor(this.#resolve, this.#reject);
      return super.then(onfulfilled, onrejected);
    }
    // create new Future to reset status
    return (new Future<T>(this.#executor)).then(onfulfilled, onrejected);
  }

  [Symbol.for("Deno.customInspect")]() {
    return "Future [Promise] { <pending> }";
  }
}
