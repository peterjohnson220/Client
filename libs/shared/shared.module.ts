import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ExchangeListComponent } from './peer';
import { PfCommonUIModule } from '../ui/common';
import { PfApiModule } from '../data/payfactors-api';
import { PfStateModule } from '../state/state.module';
import { reducers } from './peer/reducers';
import { EffectsModule } from '@ngrx/effects';
// import { PeerAdminRoutingModule } from './peer/shared-peer-routing.module';
import { ExchangeListEffects } from './peer/effects';
import { StoreModule } from '@ngrx/store';
import { GridModule } from '@progress/kendo-angular-grid';


const declarations = [
  // declarations
  ExchangeListComponent
];

@NgModule({
  imports: [
    CommonModule,

    // 3rd Party
    GridModule,
    StoreModule.forFeature('sharedPeer', reducers),
    EffectsModule.forFeature([ExchangeListEffects]),

    // Payfactors
    PfCommonUIModule,
    PfApiModule,
    PfStateModule,

    // Routing
    // PeerAdminRoutingModule,
    // Routing
    RouterModule
  ],
  declarations: declarations,
  exports: declarations
})
export class PfSharedModule { }
