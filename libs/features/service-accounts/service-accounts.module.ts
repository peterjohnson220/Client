import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ServiceAccountsEffects } from './effects';
import { reducers } from './reducers';

@NgModule({
  imports: [
    StoreModule.forFeature('feature_serviceAccounts', reducers),
    EffectsModule.forFeature([
      ServiceAccountsEffects,
    ]),
  ],
  declarations: [],
  exports: []
})
export class PfServiceAccountsModule {
  constructor() {  }
}
