import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { TotalRewardsStatementModule } from 'libs/features/total-rewards/total-rewards-statement';
import * as fromFaIcons from 'libs/features/total-rewards/total-rewards-statement/fa-icons';

import { VerificationRoutingModule } from './verification-routing.module';
import { VerificationPageComponent } from './verification.page';
import { reducers } from '../verification/reducers';
import { VerificationPageEffects } from './effects/verification.page.effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,

    // 3rd Party
    StoreModule.forFeature('totalRewards_verification', reducers),
    EffectsModule.forFeature([ VerificationPageEffects ]),
    // Payfactors
    PfCommonUIModule,
    PfCommonModule,
    PfFormsModule,
    TotalRewardsStatementModule,

    // Routing
    VerificationRoutingModule
  ],
  declarations: [
    VerificationPageComponent
  ]
})
export class VerificationModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}

