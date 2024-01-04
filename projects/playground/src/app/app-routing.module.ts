import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivateAuthGuard, canMatchAuthGuard, featureFlagGuard } from "../../../kinde-angular/src/lib/auth.guard";
import { BlaComponent } from "./components/bla.component";
import { FeatureComponent } from "./components/feature.component";

const routes: Routes = [
  {
    path: 'bla',
    component: BlaComponent,
    canActivate: [canActivateAuthGuard]
  },
  {
    path: 'feature',
    component: FeatureComponent,
    canActivate: [featureFlagGuard('has_feature')]
  },
  {
    path: 'unknown-feature',
    component: FeatureComponent,
    canActivate: [featureFlagGuard('unknown_feature')]
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
