import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigService } from './config.service';
import { configInitializer } from './initializer/config-initializer';
import { KINDE_CONFIG, kindeInitializer } from './initializer/kinde-initializer';

import { KindeAngularModule } from '../../../kinde-angular/src/lib/kinde-angular.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { kindeConfigToken } from "../../../kinde-angular/src/lib/tokens/config.token";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    KindeAngularModule.forRoot(),
    HttpClientModule,
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      deps: [ConfigService],
      useFactory: configInitializer,
      multi: true,
    },
    {
      provide: kindeConfigToken,
      deps: [ConfigService],
      useFactory: kindeInitializer,
    },
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
