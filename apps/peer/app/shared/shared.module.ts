import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EffectsModule } from '@ngrx/effects';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { PfCommonUIModule } from 'libs/ui/common';

import * as fromFaIcons from './fa-icons';
import { ExchangeExistsGuard, PeerPermissionsGuard } from './guards';
import { ExchangeRequestEffectsService, PermissionApiService } from './services';
import { PermissionsEffects, ExchangeSelectorEffects } from './effects';
import { NoExchangesPageComponent, RedirectToExchangeComponent, ExchangeSwitcherComponent } from './containers';

@NgModule({
  imports: [
    CommonModule,

    // Payfactors
    PfCommonUIModule,

    // 3rd Party
    NgbPopoverModule,
    EffectsModule.forFeature([
      PermissionsEffects, ExchangeSelectorEffects
    ]),
    FontAwesomeModule
  ],
  declarations: [
    // Components
    RedirectToExchangeComponent, ExchangeSwitcherComponent,

    // Pages
    NoExchangesPageComponent
  ],
  exports: [
    ExchangeSwitcherComponent
  ],
  providers: [
    ExchangeExistsGuard,
    PeerPermissionsGuard,
    ExchangeRequestEffectsService,
    PermissionApiService
  ]
})
export class SharedModule {
  constructor() { library.add(...fromFaIcons.faIcons); }
}
