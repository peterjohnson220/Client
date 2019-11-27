import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { DataAlertsPageComponent, DataManagementHomePageComponent, ManageDataPageComponent, TransferDataPageComponent } from './containers';
import { OrgDataLoadComponent } from './containers/pages/org-data-load/org-data-load.component';

const routes: Routes = [
  {
    path: 'org-data-load',
    component: OrgDataLoadComponent
  },
  {
    path: '',
    component: DataManagementHomePageComponent,
    children: [
      {
        path: 'data-alerts',
        component: DataAlertsPageComponent
      },
      {
        path: 'manage-data',
        component: ManageDataPageComponent
      },
      {
        path: 'transfer-data',
        component: TransferDataPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
