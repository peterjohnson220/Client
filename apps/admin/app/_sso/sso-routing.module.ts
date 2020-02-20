import { RouterModule, Routes } from '@angular/router';
import { SsoConfigPageComponent } from './containers/pages/sso-config';
import { PfAdminGuard } from '../../../../libs/security/guards';
import { NgModule } from '@angular/core';


const routes: Routes = [
  { path: '', component: SsoConfigPageComponent, canActivate: [PfAdminGuard] },
  { path: '', redirectTo: 'sso', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SsoRoutingModule {}
