import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'view', loadChildren: () => import('../_electronic-delivery/statement-view/statement-view.module').then(m => m.StatementViewModule) },
  { path: 'verification', loadChildren: () => import('../_electronic-delivery/verification/verification.module').then(m => m.VerificationModule)}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectronicDeliveryRoutingModule {}
