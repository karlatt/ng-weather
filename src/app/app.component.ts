import { Component } from "@angular/core";
import { CountryService } from "./data/services/country.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  constructor(countryService: CountryService) {
    //do some reference data init (this is one shot http get and we can afford to wait the data)
    countryService.initialize();
  }
}
