import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VerificationPageComponent } from './electronic-delivery-verification.page';

const routes: Routes = [
  { path: '', component: VerificationPageComponent },
  { path: 'view', loadChildren: () => import('../_electronic-delivery/statement-view/statement-view.module').then(m => m.StatementViewModule) },
  { path: 'verification', loadChildren: () => import('../_electronic-delivery/electronic-delivery.module').then(m => m.ElectronicDeliveryModule)}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectronicDeliveryRoutingModule {}
