import { Injectable } from '@angular/core';
import { LocalStorageProviderService } from ".";

class CustomMockStorage implements Storage {
  //this is just a mock implementation for app to compile in non-browser environments.
  //We could use a working custom implementation , but it's better to leave this to the
  // consumer of the api who can provide a context wise implementation

  [name: string]: any;
  readonly length!: number;
  clear(): void {}
  getItem(key: string): string | null {
    return null;
  }
  key(index: number): string | null {
    return null;
  }
  removeItem(key: string): void {}
  setItem(key: string, value: string): void {}
}

const customStorage: Storage = new CustomMockStorage();

@Injectable()
export class LocalStorageProviderDefaultService extends LocalStorageProviderService{

  protected getCustomStorageInstance(): Storage {
    return customStorage;
  }
}
