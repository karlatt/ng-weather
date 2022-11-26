import { Inject, Injectable, Optional } from "@angular/core";
import { Observable } from "rxjs";

import { HttpClient } from "@angular/common/http";
import {
  WeatherData,
  WeatherForecastData,
} from "../models/weather-response-data";
import { ENVIRONMENT, Environment } from "../../core/interfaces/environment";

@Injectable({ providedIn: "root" })
export class WeatherService {
  static URL = "https://api.openweathermap.org/data/2.5";
  static APPID = "5a4b2d457ecbef9eb2a71e480b947604";
  static ICON_URL =
    "https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/";

  private readonly apiUrl: string;
  private readonly appId: string;
  private readonly iconUrl: string;
  constructor(
    private http: HttpClient,
    @Optional() @Inject(ENVIRONMENT) environment: Environment
  ) {
    if (environment !== null && environment !== undefined) {
      this.apiUrl = environment.apiUrl;
      this.appId = environment.appToken;
      this.iconUrl = environment.iconUrl;
    } else {
      this.apiUrl = WeatherService.URL;
      this.appId = WeatherService.APPID;
      this.iconUrl = WeatherService.ICON_URL;
    }
  }

  getCurrentConditions(
    zipCode: string,
    countryZip: string = "us"
  ): Observable<WeatherData> {
    return this.http.get<WeatherData>(
      `${this.apiUrl}/weather?zip=${zipCode},${countryZip}&units=imperial&APPID=${this.appId}`
    );
  }

  getForecast(
    zipCode: string,
    countryZip = "us"
  ): Observable<WeatherForecastData> {
    return this.http.get<WeatherForecastData>(
      `${this.apiUrl}/forecast/daily?zip=${zipCode},${countryZip}&units=imperial&cnt=5&APPID=${this.appId}`
    );
  }

 getWeatherIcon(id, iconUrl = this.iconUrl) {
    //todo static pour pas besoin de l'injecter dans card
    if (id >= 200 && id <= 232) return iconUrl + "art_storm.png";
    if (id >= 501 && id <= 511) return iconUrl + "art_rain.png";
    if (id === 500 || (id >= 520 && id <= 531))
      return iconUrl + "art_light_rain.png";
    if (id >= 600 && id <= 622) return iconUrl + "art_snow.png";
    if (id >= 801 && id <= 804) return iconUrl + "art_clouds.png";
    if (id === 741 || id === 761) return iconUrl + "art_fog.png";
    return iconUrl + "art_clear.png";
  }
}
