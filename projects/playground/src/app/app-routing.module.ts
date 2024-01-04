import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivateAuthGuard, canMatchAuthGuard } from "../../../kinde-angular/src/lib/auth.guard";
import { BlaComponent } from "./bla.component";

const routes: Routes = [
  {
    path: 'bla',
    component: BlaComponent,
    canActivate: [canActivateAuthGuard]
  },
  {
    path: 'lazy',
    canMatch: [canMatchAuthGuard],
    loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
