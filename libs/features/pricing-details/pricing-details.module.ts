import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import * as fromFaIcons from './fa-icons';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { PricingDetailsEffects } from './effects/pricing-details.effects';
import { reducers } from './reducers';

import { PricingDetailsComponent } from './pricing-details/pricing-details.component';
import { PricingInfoComponent } from './containers';
import { PfCommonModule } from 'libs/core';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,

    // 3rd Party
    StoreModule.forFeature('feature_pricing_details', reducers),
    EffectsModule.forFeature([
      PricingDetailsEffects,
    ]),
    FontAwesomeModule,
    LayoutModule,
    GridModule,
    DropDownListModule,

    // Payfactors
    PfCommonUIModule,
    PfCommonModule,
    PfFormsModule,
  ],
  declarations: [
    // Feature
    PricingDetailsComponent,
    PricingInfoComponent,
  ],
  exports: [
    PricingDetailsComponent,
  ]
})

export class PricingDetailsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}

