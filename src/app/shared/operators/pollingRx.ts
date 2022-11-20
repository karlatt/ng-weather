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
  keepPollingActive: (res: T) => boolean,
  maxAttempts = Infinity,
  emitOnlyLast = false
): MonoTypeOperatorFunction<T> {
  return (source$) => {
    const poll$ = timer(startAfter, pollInterval).pipe(
      scan(attempts => ++attempts, 0), //accumulated counter
      tap(attemptsGuardFactory(maxAttempts)), //check
      switchMapTo(source$), // do the call
      takeWhile(keepPollingActive, true) // check condition so we don't need to unsubscribe
    );

    return emitOnlyLast ? poll$.pipe(last()) : poll$;
  };
}
