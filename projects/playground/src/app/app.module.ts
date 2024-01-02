import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KindeAngularModule } from "../../../kinde-angular/src/lib/kinde-angular.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KindeAngularModule.forRoot({
      clientId: '253580a772ff49feb36800993d1c7054',
      authDomain: 'https://surther.kinde.com',
      redirectURL: 'http://localhost:4200/',
      logoutRedirectURL: 'http://localhost:4200/',
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
