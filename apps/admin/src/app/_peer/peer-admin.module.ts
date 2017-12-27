import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { ExchangeListPageComponent, ManageExchangePageComponent, ExchangeCompaniesComponent,
         CreateExchangeModalComponent } from './containers';
import { ExchangeListEffects, ExchangeCompaniesEffects, AvailableCompaniesEffects } from './effects';
import { ExchangeExistsGuard } from './guards';
import { reducers } from './reducers';
import { PeerAdminRoutingModule } from './peer-admin-routing.module';
import { AddCompaniesModalComponent } from './containers/add-companies-modal';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // 3rd Party
    GridModule,
    StoreModule.forFeature('peerAdmin', reducers),
    EffectsModule.forFeature([ExchangeListEffects, ExchangeCompaniesEffects, AvailableCompaniesEffects]),

    // Routing
    PeerAdminRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Containers
    ExchangeCompaniesComponent, CreateExchangeModalComponent,
    AddCompaniesModalComponent,

    // Pages
    ExchangeListPageComponent, ManageExchangePageComponent
  ],
  providers: [
    // Guards
    ExchangeExistsGuard,
  ]
})
export class PeerAdminModule { }
