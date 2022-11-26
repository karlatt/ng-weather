import { Injectable, OnDestroy } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, switchMapTo, tap } from "rxjs/operators";
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

  static readonly START_AFTER = 100;
  static readonly POLL_EVERY = 30000;
  static readonly MAX_POL_NBR = 25; //for test so we don't reach limit
  static readonly CONCAT_CHAR = "/";

  ngOnDestroy(): void {
    this.continuePolling = false;
  }

  continuePolling = true;

  get trackedKey$(): Observable<Array<string>> {
    // key is zipCode concat countryCode
    return this.store.MapKey$;
  }

  get trackedData$(): Observable<Array<WeatherData>> {
    return this.store.getValue$<WeatherData>();
  }
  initializeFromSavedData(): void {
    this.store.initializeValues<WeatherData>(
      (zipAndCode) => this.fetchData(zipAndCode),
      this.localStorage.getArrayOfItems<string>()
    );
  }

  addCity(locInfo: LocationInfo, actionOnNext: () => void) {
    const mapKey = GatewayService.getStoreKey(locInfo.zip, locInfo.countryZip);
    if (!this.store.hasKey(mapKey)) {
      this.localStorage.addItemToArray(mapKey);
      this.startPollingForCity(locInfo.zip, locInfo.countryZip, actionOnNext);
    }
  }
  getIcon(id: number) {
    return this.weatherService.getWeatherIcon(id);
  }
  removeCity(locInfo: LocationInfo) {
    const mapKey = GatewayService.getStoreKey(locInfo.zip, locInfo.countryZip);
    this.removeFromKey(mapKey);
  }

  private removeFromKey(mapKey: string) {
    this.localStorage.removeItemFromArray(mapKey);
    this.store.removeItem(mapKey);
  }

  fetchData(zipAndCode: string): void {
    const array = GatewayService.getZipInfoFromKey(zipAndCode);
    this.startPollingForCity(array[0], array[1]);
  }

  startPollingForCity(
    zip: string,
    countryZip: string,
    actionOnNext: () => void = null
  ) {
    const storeKey = GatewayService.getStoreKey(zip, countryZip);
    let isInitialCall = true;
    let evaluateCondition = () => isInitialCall || this.store.hasKey(storeKey);

    this.weatherService
      .getCurrentConditions(zip, countryZip)
      .pipe(
        pollWhile(
          GatewayService.START_AFTER,
          GatewayService.POLL_EVERY,
          evaluateCondition,
          GatewayService.MAX_POL_NBR //so we don't rob the key everyone'use
        ),
        tap((data) => {
          this.store.upsertItem(storeKey, {
            ...data,
            zip: zip,
            countryZip: countryZip,
          });
          isInitialCall = false;
        }),
        catchError((err) => {
          if (err.status === 404) return of(this.removeFromKey(storeKey));
          return of(void 0);
        }) // véry simple handling just to be sure we don't keep it in store and localStorage
      )
      .subscribe(() => {
        if (actionOnNext !== null) {
          actionOnNext();
          actionOnNext = null;
        }
      });
  }
  static getStoreKey(zip: string, countryZip: string): string {
    return zip.trim().concat(GatewayService.CONCAT_CHAR, countryZip.trim());
  }

  static getZipInfoFromKey(key: string): Array<string> {
    return key.split(GatewayService.CONCAT_CHAR);
  }
}
