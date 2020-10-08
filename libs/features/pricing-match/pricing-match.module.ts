import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from '../../ui/common/common-ui-module';
import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';

import { reducers } from './reducers';
import { PricingMatchComponent } from './pricing-match/pricing-match.component';
import { PricingMatchEffects } from './effects';
import { PricingMatchDetailsComponent } from './containers/pricing-match-details/pricing-match-details.component';
import { PeerPricingMatchComponent } from './containers/peer-pricing-match/peer-pricing-match.component';
import { PricingMatchPropertyComponent } from './containers/pricing-match-property/pricing-match-property.component';

import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,

    StoreModule.forFeature('feature_pricingMatch', reducers),
    EffectsModule.forFeature([
      PricingMatchEffects,
    ]),
    FontAwesomeModule
  ],
  declarations: [
    // Components
    PricingMatchComponent,
    PricingMatchPropertyComponent,
    PricingMatchDetailsComponent,
    PeerPricingMatchComponent
  ],
  exports: [PricingMatchComponent]
})
export class PricingMatchModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
