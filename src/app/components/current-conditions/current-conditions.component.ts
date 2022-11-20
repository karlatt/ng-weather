import { Component } from '@angular/core';
import {WeatherService} from "../../data/services/weather.service";
import {LocationService} from "../../data/services/location.service";
import {Router} from "@angular/router";
import { GatewayService } from "../../data";

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
  providers :[]
})
export class CurrentConditionsComponent {

  constructor(private gateway: GatewayService,private weatherService : WeatherService, private locationService : LocationService, private router : Router)
   {

  }

get CurrentConditions() { //TODO faire composant card et donner infos en input (sauf que beaucoup de services ???!!!)
    return this.gateway.trackedData$;
  }

  showForecast(zipcode : string){
    this.router.navigate(['/forecast', zipcode])
  }



  
}
