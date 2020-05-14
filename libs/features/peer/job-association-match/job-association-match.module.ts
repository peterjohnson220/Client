import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

import { AssociateJobsEffects } from './effects/associate-jobs.effects';
import {reducers} from './reducers';

@NgModule({
  imports: [
    // Angular
    StoreModule.forFeature('feature_jobAssociationMatch', reducers),
    EffectsModule.forFeature([AssociateJobsEffects]),
  ]
})
export class JobAssociationMatchModule {
  constructor() {
  }
}
