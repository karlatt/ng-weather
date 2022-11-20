import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { ENVIRONMENT, Environment } from "../../interfaces/environment";

export enum StorageType {
  Local,
  Session,
  Custom, //for non-browser implementation or SSR,provide implementation in service.config
}


//paying my dues :)
export const STORAGE_KEY = new InjectionToken<string>('storageKey4myApp', {
  providedIn: 'root',
  factory: () => 'a601bccbe84a'
});


@Injectable()
export abstract class LocalStorageProviderService {

  get storageToUse(): Storage {
    return this.getLocalStorage(this.storageType);
  }
  private storageType: StorageType = StorageType.Local;

  constructor(

    @Inject(PLATFORM_ID) platformId: object,
    @Inject(ENVIRONMENT) environment: Environment
  ) {

    if (isPlatformBrowser(platformId)) {
      this.storageType = environment.chosenStorage ?? this.storageType;
    } else {
      //no choice at the moment :)
      this.storageType = StorageType.Custom;
    }
  }

  protected abstract getCustomStorageInstance():Storage;

  private getLocalStorage(storageType: StorageType): Storage {
    switch (storageType) {
      case StorageType.Local:
        return localStorage;
      case StorageType.Session:
        return sessionStorage;
      case StorageType.Custom:
        return this.getCustomStorageInstance();
      default:
        throw new Error(
          'the storageType parameter you provided is not matching any known type'
        );
    }
}
}

