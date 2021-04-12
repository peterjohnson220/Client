import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PfCommonModule } from 'libs/core';

import { reducers } from './reducers';
import { NationalAverageEffects } from './effects';
import { OrgWeightedNatAvgCardComponent } from './components/org-weighted-nat-avg-card';

@NgModule({
  imports: [
    CommonModule,
    PfCommonModule,
    StoreModule.forFeature('feature_peer_nationalAverage', reducers),
    EffectsModule.forFeature([
      NationalAverageEffects,
    ]),
  ],
  declarations: [OrgWeightedNatAvgCardComponent],
  exports: [OrgWeightedNatAvgCardComponent]
})
export class NationalAverageModule {
  constructor() {
  }
}
