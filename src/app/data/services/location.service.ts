import { Injectable } from '@angular/core';
import {WeatherService} from "./weather.service";

export const LOCATIONS : string = "locations";

@Injectable({ providedIn: 'root' })
export class LocationService {

  locations : string[] = [];

  constructor(private weatherService : WeatherService) {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString)
      this.locations = JSON.parse(locString);
    for (let loc of this.locations)
     ;
  }

  addLocation(zipcode : string){
    this.locations.push(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    ;
  }

  removeLocation(zipcode : string){
    let index = this.locations.indexOf(zipcode);
    if (index !== -1){
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      ;
    }
  }
}
