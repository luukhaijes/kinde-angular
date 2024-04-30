import { Component, OnInit } from '@angular/core';
import { KindeAngularService } from '../../../kinde-angular/src/lib/kinde-angular.service';
import { Observable, map } from 'rxjs';

interface Organization {
  id: string,
  name: string,
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public title = 'kinde-config-async';
  public isAuthenticated$!: Observable<boolean>;
  public organizationList$!: Observable<Organization[] | undefined>

  public constructor(
    private readonly authService: KindeAngularService,
  ) {}

  login() {
    this.authService.login();
  }

  public ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated$;

    this.organizationList$ = this.authService.getClaim<Organization[]>('organizations', 'id_token').pipe(
      map((organizations) => organizations?.value)
    )
  }
}
