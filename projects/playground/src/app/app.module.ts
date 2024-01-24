import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { KindeAngularModule } from "../../../kinde-angular/src/lib/kinde-angular.module";
import { LoggedOutComponent } from './components/logged-out/logged-out.component';
import { LoggedInComponent } from './components/logged-in/logged-in.component';
import { NgOptimizedImage } from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    LoggedOutComponent,
    LoggedInComponent
  ],
  imports: [
    BrowserModule,
    KindeAngularModule.forRoot({
      clientId: 'client_id_here',
      authDomain: 'https://domain.kinde.com',
      redirectURL: 'http://localhost:4200/',
      logoutRedirectURL: 'http://localhost:4200/',
    }),
    NgOptimizedImage
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
