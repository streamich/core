// ets_tracing: off

import type * as Tp from "../../../../Collections/Immutable/Tuple"
import * as T from "../../../../Effect"
import * as E from "../../../../Either"
import type { Predicate } from "../../../../Function"
import type * as M from "../../../../Managed"
import type * as C from "../core"
import * as PartitionEither from "./partitionEither"

/**
 * Partition a stream using a predicate. The first stream will contain all element evaluated to true
 * and the second one will contain all element evaluated to false.
 * The faster stream may advance by up to buffer elements further than the slower one.
 */
export function partition_<R, E, A>(
  self: C.Stream<R, E, A>,
  p: Predicate<A>,
  buffer = 16
): M.Managed<R, E, Tp.Tuple<[C.IO<E, A>, C.IO<E, A>]>> {
  return PartitionEither.partitionEither_(
    self,
    (a) => (p(a) ? T.succeed(E.left(a)) : T.succeed(E.right(a))),
    buffer
  )
}

/**
 * Partition a stream using a predicate. The first stream will contain all element evaluated to true
 * and the second one will contain all element evaluated to false.
 * The faster stream may advance by up to buffer elements further than the slower one.
 *
 * @ets_data_first partition_
 */
export function partition<A>(p: Predicate<A>, buffer = 16) {
  return <R, E>(self: C.Stream<R, E, A>) => partition_(self, p, buffer)
}
