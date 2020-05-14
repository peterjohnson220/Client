import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { FeatureRoutingModule } from './feature_module-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,

    // Routing
    FeatureRoutingModule
  ]
})
export class FeatureModule { }
