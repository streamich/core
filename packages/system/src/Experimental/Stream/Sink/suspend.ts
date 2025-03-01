// ets_tracing: off

import * as CH from "../Channel"
import * as C from "./core"

/**
 * Returns a lazily constructed sink that may require effects for its creation.
 */
export function suspend<R, InErr, In, OutErr, L, Z>(
  f: () => C.Sink<R, InErr, In, OutErr, L, Z>
): C.Sink<R, InErr, In, OutErr, L, Z> {
  return new C.Sink(CH.suspend(() => f().channel))
}
