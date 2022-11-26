import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CountryData } from "../models";

@Injectable({ providedIn: "root" })
export class CountryService {
  private _countries!: Array<CountryData>; //no need for store as this is local cached reference data

  constructor(private readonly httpClient: HttpClient) {}

  public get countriesData(): Array<CountryData> {
    return this._countries;
  }

  public initialize(): void {
    this.httpClient
      .get<Array<CountryData>>(`assets/countries.json`)
      .subscribe((countries) => (this._countries = countries));
  }

  public getCountryData(code: string): CountryData | undefined {
    const upperCode = code.trim().toUpperCase();
    return this._countries.find((c) => c.code === upperCode);
  }

  public filter(filterValue: string): Array<CountryData> {
    const toUpper = filterValue.trim().toUpperCase();
    return this._countries.filter((c) =>
      c.name.toUpperCase().includes(toUpper)
    );
  }
}
