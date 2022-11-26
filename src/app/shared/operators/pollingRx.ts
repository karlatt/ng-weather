import { timer, MonoTypeOperatorFunction } from "rxjs";
import { scan, tap, switchMapTo, takeWhile, last } from "rxjs/operators";

function attemptsGuardFactory(maxAttempts: number) {
  return (attemptsCount: number) => {
    if (attemptsCount > maxAttempts) {
      throw new Error("Exceeded maxAttempts");
    }
  };
}

export function pollWhile<T>(
  startAfter: number,
  pollInterval: number,
  keepPollingActive: () => boolean,
  maxAttempts = Infinity,
  emitOnlyLast = false
): MonoTypeOperatorFunction<T> {
  return (source$) => {
    const poll$ = timer(startAfter, pollInterval).pipe(
      scan(attempts => ++attempts, 0), //accumulated counter
      tap(attemptsGuardFactory(maxAttempts)), //check
      takeWhile(keepPollingActive, false),
      switchMapTo(source$), // do the call
  // check condition so we don't need to unsubscribe
    );

    return emitOnlyLast ? poll$.pipe(last()) : poll$;
  };
}
