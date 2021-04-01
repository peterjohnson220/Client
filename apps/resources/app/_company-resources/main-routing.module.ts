import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourcesComponent } from './components/resources/resources.component';
import { CompanyResourcesPageComponent } from './company-resources.page/company-resources.page';
import { PermissionGuard } from 'libs/security/guards';
import { PermissionCheckEnum, Permissions } from 'libs/constants';


const routes: Routes = [
  { path: '', component: ResourcesComponent },
  {
    path: 'company-resources',
    component: CompanyResourcesPageComponent,
    canActivate: [PermissionGuard],
    data: {Permissions: [Permissions.VIEW_COMPANY_RESOURCES], Check: PermissionCheckEnum.Single}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
