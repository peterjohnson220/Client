import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms/forms.module';
import { PeerAdminRoutingModule } from './peer-admin-routing.module';
import { CreateExchangeModalComponent } from './components';
import { ExchangeListPageComponent } from './containers';
import { ExchangeListEffects } from './effects';
import { reducers } from './reducers';

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
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    CreateExchangeModalComponent,

    // Pages
    ExchangeListPageComponent
  ]
})
export class PeerAdminModule { }
