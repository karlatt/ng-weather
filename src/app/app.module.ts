import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { ZipcodeEntryComponent } from "./components/zipcode-entry/zipcode-entry.component";
import { ForecastsListComponent } from "./components/forecasts-list/forecasts-list.component";
import { CurrentConditionsComponent } from "./components/current-conditions/current-conditions.component";
import { MainPageComponent } from "./components/main-page/main-page.component";
import { RouterModule } from "@angular/router";
import { routing } from "./app.routing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { ENVIRONMENT } from "./core/interfaces/environment";
import {
  LocalStorageProviderService,
  LocalStorageProviderDefaultService,
} from "./core/services/storage";
import { GatewayService } from "./data";
import { StateButtonComponent } from "./components/state-button/state-button.component";
import { SelectionHiLightPipe } from "./shared";
import { SelectionTextInputComponent } from "./components/selection-text-input/selection-text-input.component";

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    StateButtonComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
    SelectionTextInputComponent,
    SelectionHiLightPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register("/ngsw-worker.js", {
      enabled: environment.production,
    }),
  ],
  providers: [
    {
      provide: ENVIRONMENT,
      useValue: environment,
    },
    {
      provide: LocalStorageProviderService,
      useClass: LocalStorageProviderDefaultService,
    },
    GatewayService,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
