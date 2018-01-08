import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfCommonModule } from 'libs/common';
import { PfSharedModule } from 'libs/shared';

import { ExchangeListPageComponent, ManageExchangePageComponent, ExchangeCompaniesComponent,
         CreateExchangeModalComponent, ImportExchangeJobsModalComponent } from './containers';
import {
  ExchangeListEffects, ExchangeCompaniesEffects, AvailableCompaniesEffects,
  ManageExchangeEffects, AvailableJobsEffects
} from './effects';
import { ExchangeExistsGuard } from './guards';
import { reducers } from './reducers';
import { PeerAdminRoutingModule } from './peer-admin-routing.module';
import { AddCompaniesModalComponent } from './containers/add-companies-modal';
import { AddJobsModalComponent } from './containers/add-jobs-modal';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // 3rd Party
    GridModule,
    StoreModule.forFeature('peerAdmin', reducers),
    EffectsModule.forFeature([
      ExchangeListEffects,
      ExchangeCompaniesEffects,
      ManageExchangeEffects,
      AvailableCompaniesEffects,
      AvailableJobsEffects]),

    // Routing
    PeerAdminRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfSharedModule
  ],
  declarations: [
    // Containers
    ExchangeCompaniesComponent,
    CreateExchangeModalComponent,
    ImportExchangeJobsModalComponent,
    AddCompaniesModalComponent,
    AddJobsModalComponent,

    // Pages
    ExchangeListPageComponent,
    ManageExchangePageComponent
  ],
  providers: [
    // Guards
    ExchangeExistsGuard,
  ]
})
export class PeerAdminModule { }
