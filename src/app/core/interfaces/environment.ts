import { InjectionToken } from "@angular/core";
import { StorageType } from "../services/storage/storage.service.config.base";

export interface Environment
{
  production:boolean;
  appToken:string;
  apiUrl:string;
  iconUrl:string;
  chosenStorage?:StorageType;
}
export const ENVIRONMENT: InjectionToken<Environment> =
    new InjectionToken<Environment>("environment");

