import { Component } from '@angular/core';
import { KindeAngularService } from "../../../kinde-angular/src/lib/kinde-angular.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isAuthenticated$ = this.authService.isAuthenticated$;
  isLoading$ = this.authService.isLoading$;
  constructor(private authService: KindeAngularService){
  }
}
