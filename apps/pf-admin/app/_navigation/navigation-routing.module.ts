import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PfAdminGuard } from 'libs/security';
import { NavigationPageComponent } from './containers';

const routes: Routes = [
  { path: '', component: NavigationPageComponent, canActivate: [PfAdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavigationRoutingModule { }
