import { Component } from "@angular/core";
import { WeatherService } from "../../data/services/weather.service";
import { ActivatedRoute } from "@angular/router";
import { WeatherForecastData } from "../../data";

@Component({
  selector: "app-forecasts-list",
  templateUrl: "./forecasts-list.component.html",
  styleUrls: ["./forecasts-list.component.css"],
})
export class ForecastsListComponent {
  zipcode: string;
  countryZip: string;
  forecast: WeatherForecastData;

  constructor(private readonly weatherService: WeatherService, route: ActivatedRoute) {
    route.params.subscribe((params) => {
      this.zipcode = params["zipcode"];
      this.countryZip = params["countryZip"];
      weatherService
        .getForecast(this.zipcode, this.countryZip)
        .subscribe((data) => (
          this.forecast = data)
          );
    });
  }
}
