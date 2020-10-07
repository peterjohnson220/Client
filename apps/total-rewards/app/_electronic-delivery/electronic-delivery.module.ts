import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';

import { ElectronicDeliveryRoutingModule } from './electronic-delivery-routing.module';
import { VerificationPageComponent } from './electronic-delivery-verification.page';


@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party

    // Payfactors
    PfCommonUIModule,
    PfCommonModule,
    PfFormsModule,

    // Routing
    ElectronicDeliveryRoutingModule
  ],
  declarations: [
    VerificationPageComponent
  ]
})
export class ElectronicDeliveryModule {
  constructor() {}
}

