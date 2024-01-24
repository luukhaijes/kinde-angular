import { Component } from '@angular/core';
import { KindeAngularService } from "../../../../../kinde-angular/src/lib/kinde-angular.service";

@Component({
  selector: 'app-logged-out',
  templateUrl: './logged-out.component.html',
  styleUrl: './logged-out.component.scss'
})
export class LoggedOutComponent {
  constructor(private authService: KindeAngularService) {
  }

  login() {
    this.authService.login();
  }

  register() {
    this.authService.register();
  }
}
