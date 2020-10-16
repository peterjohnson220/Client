import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';

import { VerificationRoutingModule } from './verification-routing.module';
import { VerificationPageComponent } from './verification.page';
import { reducers } from '../statement-view/reducers';
import { VerificationPageEffects } from './effects/verification.page.effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('totalRewards_verification', reducers),
    EffectsModule.forFeature([ VerificationPageEffects ]),
    // Payfactors
    PfCommonUIModule,
    PfCommonModule,
    PfFormsModule,

    // Routing
    VerificationRoutingModule
  ],
  declarations: [
    VerificationPageComponent
  ]
})
export class VerificationModule {
  constructor() {}
}

