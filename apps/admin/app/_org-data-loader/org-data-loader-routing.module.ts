import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageFieldMappingsPageComponent } from './containers/pages';

const routes: Routes = [
  { path: 'manage-field-mappings', component: ManageFieldMappingsPageComponent},
  { path: '', redirectTo: 'manage-field-mappings', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgDataLoaderRoutingModule { }
