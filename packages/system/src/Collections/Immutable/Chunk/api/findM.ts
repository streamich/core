import * as T from "../../../../Effect"
import * as O from "../../../../Option"
import type * as Chunk from "../core"
import { concreteId } from "../definition"

/**
 * Returns the first element that satisfies the effectful predicate.
 */
export function findM_<R, E, A>(
  self: Chunk.Chunk<A>,
  f: (a: A) => T.Effect<R, E, boolean>
): T.Effect<R, E, O.Option<A>> {
  return T.suspend(() => {
    const iterator = concreteId(self).arrayLikeIterator()
    let next: IteratorResult<Chunk.IterableArrayLike<A>, any>
    const loop = (
      iterator: Iterator<Chunk.IterableArrayLike<A>>,
      array: Chunk.IterableArrayLike<A>,
      i: number,
      length: number
    ): T.Effect<R, E, O.Option<A>> => {
      if (i < length) {
        const a = array[i]!

        return T.chain_(f(a), (r) =>
          r ? T.succeed(O.some(a)) : loop(iterator, array, i + 1, length)
        )
      } else if (!(next = iterator.next()).done) {
        return loop(iterator, next.value, 0, next.value.length)
      } else {
        return T.succeed(O.none)
      }
    }

    next = iterator.next()

    if (!next.done) {
      return loop(iterator, next.value, 0, next.value.length)
    } else {
      return T.succeed(O.none)
    }
  })
}

/**
 * Returns the first element that satisfies the effectful predicate.
 */
export function findM<R, E, A>(f: (a: A) => T.Effect<R, E, boolean>) {
  return (self: Chunk.Chunk<A>) => findM_(self, f)
}
