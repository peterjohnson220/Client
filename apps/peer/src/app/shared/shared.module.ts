import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';

import { ExchangeExistsGuard } from './guards';
import { reducers } from './reducers';
import { ExchangeRequestEffectsService } from './services';

@NgModule({
  imports: [
    // 3rd party
    StoreModule.forFeature('peer_shared', reducers),
  ],
  providers: [
    ExchangeExistsGuard, ExchangeRequestEffectsService
  ]
})
export class SharedModule { }
