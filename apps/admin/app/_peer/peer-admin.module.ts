import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfCommonModule } from 'libs/core';
import { PfPeerExchangeListModule } from 'libs/features';

import { ExchangeListPageComponent, ManageExchangePageComponent, ExchangeCompaniesComponent,
         CreateExchangeModalComponent, ImportExchangeJobsModalComponent, ExchangeJobsComponent,
         ManageExchangeSectionHeaderComponent, PendingExchangeAccessRequestsComponent,
         PayfactorsCompanyExchangeInvitationsComponent, NewCompanyExchangeInvitationsComponent } from './containers';
import {
  ExchangeListEffects, ExchangeCompaniesEffects, AvailableCompaniesEffects,
  ManageExchangeEffects, ExchangeJobsEffects, AvailableJobsEffects, PendingExchangeAccessRequestsEffects,
  PayfactorsCompanyExchangeInvitationsEffects, NewCompanyExchangeInvitationsEffects
} from './effects';
import { ExchangeExistsGuard } from './guards';
import { reducers } from './reducers';
import { GridHelperService } from './services';
import { PeerAdminRoutingModule } from './peer-admin-routing.module';
import { AddCompaniesModalComponent } from './containers/add-companies-modal';
import { AddJobsModalComponent } from './containers/add-jobs-modal';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    GridModule,
    StoreModule.forFeature('peerAdmin', reducers),
    EffectsModule.forFeature([
      ExchangeListEffects,
      ExchangeCompaniesEffects,
      ManageExchangeEffects,
      AvailableCompaniesEffects,
      ExchangeJobsEffects,
      AvailableJobsEffects,
      PendingExchangeAccessRequestsEffects,
      PayfactorsCompanyExchangeInvitationsEffects,
      NewCompanyExchangeInvitationsEffects
    ]),

    // Routing
    PeerAdminRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfPeerExchangeListModule
  ],
  declarations: [
    // Containers
    ExchangeCompaniesComponent,
    CreateExchangeModalComponent,
    ImportExchangeJobsModalComponent,
    AddCompaniesModalComponent,
    ExchangeJobsComponent,
    AddJobsModalComponent,
    ManageExchangeSectionHeaderComponent,
    PendingExchangeAccessRequestsComponent,
    PayfactorsCompanyExchangeInvitationsComponent,
    NewCompanyExchangeInvitationsComponent,

    // Pages
    ExchangeListPageComponent,
    ManageExchangePageComponent
  ],
  providers: [
    // Guards
    ExchangeExistsGuard,

    // Services
    GridHelperService
  ]
})
export class PeerAdminModule { }
