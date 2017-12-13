import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfCommonUIModule } from 'libs/ui/common';

import { ExchangeListPageComponent, ManageExchangePageComponent, ExchangeCompaniesComponent } from './containers';
import { ExchangeListEffects, ExchangeCompaniesEffects } from './effects';
import { ExchangeExistsGuard } from './guards/';
import { reducers } from './reducers';
import { PeerAdminRoutingModule } from './peer-admin-routing.module';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    GridModule,
    StoreModule.forFeature('peerAdmin', reducers),
    EffectsModule.forFeature([ExchangeListEffects, ExchangeCompaniesEffects]),

    // Routing
    PeerAdminRoutingModule,

    // Payfactors
    PfCommonUIModule,
  ],
  declarations: [
    // Containers
    ExchangeCompaniesComponent,

    // Pages
    ExchangeListPageComponent, ManageExchangePageComponent
  ],
  providers: [
    // Guards
    ExchangeExistsGuard,
  ]
})
export class PeerAdminModule { }
