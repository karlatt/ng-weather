import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { CountryData, GatewayService } from "../../data";
import { CountryService } from "../../data/services/country.service";

@Component({
  selector: "app-zipcode-entry",
  templateUrl: "./zipcode-entry.component.html",
})
export class ZipcodeEntryComponent {
  private countriesData$: Subject<Array<CountryData>> = new BehaviorSubject<
    Array<CountryData>
  >(this.countryService.countriesData);

  get countriesDataSource$() {
    return this.countriesData$ as Observable<Array<CountryData>>;
  }

  private get zipCode() {
    return this.zeForm.value.zipCode;
  }
  private get countryZip() {
    return this.zeForm.value.countryZip;
  }

  public zeForm: FormGroup = this.builder.group({
    zipCode: this.builder.control(null, Validators.required),
    countryZip: this.builder.control(null, Validators.required),
  });
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly builder: FormBuilder,
    private readonly countryService: CountryService
  ) {}

  buttonLoading: boolean = false;
  actionClicked() {
    this.buttonLoading = true;
    this.gatewayService.addCity(
      { countryZip: this.countryZip, zip: this.zipCode },
      () => {
        this.buttonLoading = false;
        this.zeForm.reset();
      }
    );
  }

  public applyFilter(value: string) {
    this.countriesData$.next(
      value?.length > 0
        ? this.countryService.filter(value)
        : this.countryService.countriesData
    );
  }
}
