import { Injectable, OnDestroy } from "@angular/core";
import { Observable } from "rxjs";
import { DataStoreService } from "../../core/services/data";
import { LocalStorageService } from "../../core/services/storage";
import { pollWhile } from "../../shared/operators/pollingRx";
import { LocationInfo, WeatherData } from "../models";
import { WeatherService } from "./weather.service";

@Injectable({
  providedIn: "root",
})
export class GatewayService implements OnDestroy {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly localStorage: LocalStorageService,
    private readonly store: DataStoreService
  ) {}

  static readonly START_AFTER = 1000;

  static readonly POLL_EVERY = 30000;

  static readonly MAX_POL_NBR = 1000;

  static readonly CONCAT_CHAR = "/";

  ngOnDestroy(): void {
    this.continuePolling = false;
  }

  continuePolling = true;

  get trackedKey$(): Observable<Array<string>> {
    //  zip codes concat cityCode
    return this.store.MapKey$;
  }

  get trackedData$(): Observable<Array<WeatherData>> {
    return this.store.getValue$<WeatherData>();
  }
  initializeFromSavedData(): void {
    this.store.initializeValues<WeatherData>(
      (zipAndCode) => this.fetchData(zipAndCode),
      this.localStorage.getArrayOfItems<string>(),
      true
    );
  }

  addCity(locInfo: LocationInfo) {
    const mapKey = GatewayService.getStoreKey(locInfo.zip, locInfo.zipCountry);
    this.localStorage.addItemToArray(mapKey);
    this.startPollingForCity(locInfo.zip, locInfo.zipCountry);
  }

  removeCity(locInfo: LocationInfo) {
    const mapKey = GatewayService.getStoreKey(locInfo.zip, locInfo.zipCountry);
    this.localStorage.removeItemFromArray(mapKey);
    this.store.removeItem(mapKey);
  }

  fetchData(zipAndCode: string): void {
    const array = GatewayService.getZipInfoFromKey(zipAndCode);
    this.startPollingForCity(array[0], array[1]);
  }

  startPollingForCity(zip: string, cityZip: string) {
    const storeKey = GatewayService.getStoreKey(zip, cityZip);
    let isInit = true;
    this.weatherService
      .getCurrentConditions(zip, cityZip)
      .pipe(
        pollWhile(
          GatewayService.START_AFTER,
          GatewayService.POLL_EVERY,
          (_) => isInit || this.store.hasKey(storeKey),
          GatewayService.MAX_POL_NBR //so we don't pollute the key everyone'use
        )
      )
      .subscribe((data) => {
        this.store.upsertItem(GatewayService.getStoreKey(zip, cityZip), {
          ...data,
          zip: zip,
        });
        isInit = false;
      });
  }
  static getStoreKey(zip: string, cityZip: string): string {
    return zip.trim().concat(GatewayService.CONCAT_CHAR, cityZip.trim());
  }

  static getZipInfoFromKey(key: string): Array<string> {
    return key.split(GatewayService.CONCAT_CHAR);
  }
}
