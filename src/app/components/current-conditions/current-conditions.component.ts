import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GatewayService } from "../../data";

@Component({
  selector: "app-current-conditions",
  templateUrl: "./current-conditions.component.html",
  styleUrls: ["./current-conditions.component.css"],
  providers: [],
})
export class CurrentConditionsComponent implements OnInit {
  constructor(private gateway: GatewayService, private router: Router) {}
  ngOnInit(): void {
    this.gateway.initializeFromSavedData();
  }

  get CurrentConditions() {
    //TODO faire composant card et donner infos en input (sauf que beaucoup de services ???!!!)
    return this.gateway.trackedData$;
  }

  showForecast(zipcode: string, countryZip: string) {
    this.router.navigate(["/forecast", zipcode, countryZip]);
  }
}
