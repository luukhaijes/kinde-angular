import { Component, OnInit } from '@angular/core';
import { KindeAngularService } from "../../../kinde-angular/src/lib/kinde-angular.service";
import { of } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'playground';
  isAuth = this.authService.isAuthenticated$;
  token = this.authService.accessToken$;
  constructor(private authService: KindeAngularService){
  }

  ngOnInit() {
    if (window.location.search) {
      this.handleCallback();
    }
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  getToken() {
    this.authService.getAccessToken().subscribe(token => console.log(token));
  }

  handleCallback() {
    // this.authService.handleCallback();
  }
}
