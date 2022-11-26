import { Inject, Injectable } from '@angular/core';
import {
  LocalStorageProviderService,
  STORAGE_KEY,
} from './storage.service.config.base';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private currentStorage: Storage;

  constructor(
    @Inject(STORAGE_KEY) private readonly storageKey: string,
    localStorageProvider: LocalStorageProviderService
  ) {
    this.currentStorage = localStorageProvider.storageToUse;
  }

  setItem<T>(itemToSave: T): void {
    this.currentStorage.setItem(this.storageKey, JSON.stringify(itemToSave));
  }
  getItem<T>(): T {
    try {
      return JSON.parse(this.currentStorage.getItem(this.storageKey)!) as T;
    } catch (error) {
      localStorage.removeItem(this.storageKey);
      let message = `Can't get element with key ${this.storageKey} from storage ,or cannot cast it to the asked type T.\n${this.storageKey} will be removed from storage..`;
      if (error instanceof Error) {
        message += `\nCause:${error.message}`;
      }
      throw new Error(message);
    }
  }
  removeDefaultItem() {
    this.currentStorage.removeItem(this.storageKey);
  }
  clear() {
    this.currentStorage.clear();
  }
  getArrayOfItems<T>(): Array<T> {
    //if no exception , returns empty arrays for convenience instead of null | undefined , so we can call this method even if no item is set in currentStorage
    const stringified = this.currentStorage.getItem(this.storageKey);
    if (!stringified || !stringified.length) {
      return [];
    }
    try {
      const array = JSON.parse(stringified);
      if (Array.isArray(array)) {
        return array.map((a) => <T>a);
      }
      return []; //we don't want anything but an array, would it be empty ...
    } catch (error) {
      localStorage.removeItem(this.storageKey);
      let message = `Can't get element with key ${this.storageKey} from storage ,or cannot cast it to the asked type T.\n${this.storageKey} will be removed from storage..`;
      if (error instanceof Error) {
        message += `\nCause:${error.message}`;
      }
      throw new Error(message);
    }
  }
  addItemToArray<T>(item: T): void {
    // we store arrays very often in localStorage, so it's not bad to have this convenience method
    const arrayFromStorage = this.getArrayOfItems<T>();
    if (arrayFromStorage.indexOf(item) < 0) {
      // not here
      arrayFromStorage.push(item);
    }
    this.setItem(arrayFromStorage);
  }
  removeItemFromArray<T>(item: T): void {
    const arrayFromStorage = this.getArrayOfItems<T>();
    const index = arrayFromStorage.indexOf(item);
    if (index >= 0) {
      this.setItem([
        ...arrayFromStorage.slice(0, index),
        ...arrayFromStorage.slice(index + 1),
      ]);
    }
  }
}
