import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';

import { PfCommonUIModule } from 'libs/ui/common';

import { ExchangeExistsGuard, PeerPermissionsGuard } from './guards';
import { ExchangeRequestEffectsService, PermissionApiService } from './services';
import { PermissionsEffects, ExchangeSelectorEffects } from './effects';
import { NoExchangesPageComponent, RedirectToExchangeComponent } from './containers';

@NgModule({
  imports: [
    EffectsModule.forFeature([
      PermissionsEffects, ExchangeSelectorEffects
    ]),

    // Payfactors
    PfCommonUIModule
  ],
  declarations: [
    // Components
    RedirectToExchangeComponent,

    // Pages
    NoExchangesPageComponent
  ],
  providers: [
    ExchangeExistsGuard,
    PeerPermissionsGuard,
    ExchangeRequestEffectsService,
    PermissionApiService
  ]
})
export class SharedModule { }
