import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfCommonUIModule } from 'libs/ui/common';

import { ExchangeGridComponent, CreateExchangeModalComponent } from './components';
import { ExchangeListPageComponent } from './containers';
import { ExchangeListEffects } from './effects';
import { reducers } from './reducers';
import { PeerAdminRoutingModule } from './peer-admin-routing.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // 3rd Party
    GridModule,
    StoreModule.forFeature('peerAdmin', reducers),
    EffectsModule.forFeature([ExchangeListEffects]),

    // Routing
    PeerAdminRoutingModule,

    // Payfactors
    PfCommonUIModule
  ],
  declarations: [
    // Components
    ExchangeGridComponent,
    CreateExchangeModalComponent,

    // Pages
    ExchangeListPageComponent
  ]
})
export class PeerAdminModule { }








