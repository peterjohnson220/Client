import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';

import { ExchangeExistsGuard, PeerPermissionsGuard } from './guards';
import { ExchangeRequestEffectsService, PermissionApiService } from './services';
import { PermissionsEffects } from './effects/permissions.effects';


@NgModule({
  imports: [
    EffectsModule.forFeature([
      PermissionsEffects
    ])
  ],
  providers: [
    ExchangeExistsGuard,
    PeerPermissionsGuard,
    ExchangeRequestEffectsService,
    PermissionApiService
  ]
})
export class SharedModule { }
