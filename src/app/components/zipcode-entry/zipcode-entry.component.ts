import { Component } from "@angular/core";
import { GatewayService, LocationInfo } from "../../data";

@Component({
  selector: "app-zipcode-entry",
  templateUrl: "./zipcode-entry.component.html",
})
export class ZipcodeEntryComponent {
  constructor(private service: GatewayService) {}

  addLocation(code: string) {
    this.service.addCity({ zipCountry: "fr", zip: code });
  }
}
