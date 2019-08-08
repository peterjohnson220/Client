import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { DataAlertsPageComponent, DataManagementHomePageComponent,
  ManageDataPageComponent, TransferDataPageComponent
} from './containers';

const routes: Routes = [
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
