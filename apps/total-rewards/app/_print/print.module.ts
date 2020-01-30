import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { SharedModule } from '../shared';

import { TotalRewardsTemplatePageComponent } from './containers';
import { PrintRoutingModule } from './print-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    PrintRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    SharedModule,
  ],
  declarations: [
    // Pages
    TotalRewardsTemplatePageComponent
  ]
})
export class PrintModule { }
