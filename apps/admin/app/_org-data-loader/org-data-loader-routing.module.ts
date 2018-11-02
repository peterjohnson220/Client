import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PfAdminGuard } from 'libs/security/guards';
import { ManageFieldMappingsPageComponent } from './containers/pages';

const routes: Routes = [
  { path: 'manage-field-mappings', component: ManageFieldMappingsPageComponent, canActivate: [PfAdminGuard]},
  { path: '', redirectTo: 'manage-field-mappings', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgDataLoaderRoutingModule { }
