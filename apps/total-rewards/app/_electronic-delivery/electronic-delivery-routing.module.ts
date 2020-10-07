import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VerificationPageComponent } from './electronic-delivery-verification.page';

const routes: Routes = [
  { path: '', component: VerificationPageComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectronicDeliveryRoutingModule {}
