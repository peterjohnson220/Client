import { NgModule } from '@angular/core';
import {reducers} from './reducers';
import {StoreModule} from '@ngrx/store';
import {PricingMatchComponent} from './pricing-match/pricing-match.component';
import {EffectsModule} from '@ngrx/effects';
import {PricingMatchEffects} from './effects';
import {PfCommonUIModule} from '../../ui/common/common-ui-module';
import {PfCommonModule} from '../../core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PricingMatchDetailsComponent } from './containers/pricing-match-details/pricing-match-details.component';
import { PeerPricingMatchComponent } from './containers/peer-pricing-match/peer-pricing-match.component';
import {PricingMatchPropertyComponent} from './containers/pricing-match-property/pricing-match-property.component';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
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

    StoreModule.forFeature('feature_pricingMatch', reducers),
    EffectsModule.forFeature([
      PricingMatchEffects,
    ]),
    FontAwesomeModule,
  ],
  declarations: [PricingMatchComponent, PricingMatchPropertyComponent,
    PricingMatchDetailsComponent, PeerPricingMatchComponent],
  exports: [PricingMatchComponent],
})
export class PricingMatchModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
