import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DataStoreService {
  constructor() {}
  private bucket: Map<string, unknown> = new Map(); // toTry : as Map keys could be any object , generics keys as well
  private isInitialized: boolean = false;
  private observableBucket$ = new BehaviorSubject<Map<string, unknown>>(
    this.bucket
  );

  public initializeValues<T>(
    fetchFunc: (key: string) => void,
    initValues: Array<string>,
    emitAfterInit: boolean = true
  ): void {
    if (this.isInitialized) return;
    initValues.forEach((k) => fetchFunc(k));
    this.isInitialized = true;
    if (emitAfterInit) this.emit();
  }

  public get MapKey$(): Observable<Array<string>> {
    return this.observableBucket$.pipe(
      map((zeMap) => Array.from(zeMap.keys()))
    );
  }

  public getValue$<T>(): Observable<Array<T>> {
    return this.observableBucket$.pipe(
      map((zeMap) => Array.from(zeMap.values() as IterableIterator<T>))
    );
  }

  public hasKey(key: string) {
    return this.bucket.has(key);
  }

  public upsertItemWithFactory<T>(
    key: string,
    tFactory: (values: Partial<T>) => T,
    emitAfterUpsert: boolean = true
  ) {
    this.bucket.set(key, tFactory({}));
    if (emitAfterUpsert) this.emit();
  }

  public upsertItem<T>(key: string, tItem: T, emitAfterUpsert: boolean = true) {
    this.bucket.set(key, tItem);
    if (emitAfterUpsert) this.emit();
  }

  public removeItem(key: string, emitAfterRemove: boolean = true) {
    this.bucket.delete(key);
    if (emitAfterRemove) this.emit();
  }

  private emit(): void {
    this.bucket = new Map(this.bucket); //do the cloning here so we don't have to bother about immutability
    this.observableBucket$.next(this.bucket);
  }
}
