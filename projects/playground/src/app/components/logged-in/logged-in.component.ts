import { Component } from '@angular/core';
import { KindeAngularService } from "../../../../../kinde-angular/src/lib/kinde-angular.service";

@Component({
  selector: 'app-logged-in',
  templateUrl: './logged-in.component.html',
  styleUrl: './logged-in.component.scss'
})
export class LoggedInComponent {
  user$ = this.authService.user$;
  constructor(private authService: KindeAngularService) {
  }

  logout() {
    this.authService.logout();
  }
  getToken() {
    this.authService.getAccessToken().then(t => console.log(t));
  }
}
