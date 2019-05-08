import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { PfKendoExtensions } from 'libs/extensions';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfCommonModule } from 'libs/core';

import { ExchangeListPageComponent, ManageExchangePageComponent, ExchangeCompaniesComponent,
         CreateExchangeModalComponent, ImportExchangeJobsModalComponent, ExchangeJobsComponent,
         ManageExchangeSectionHeaderComponent, ExchangeAccessRequestsComponent,
         PayfactorsCompanyExchangeInvitationsComponent, NewCompanyExchangeInvitationsComponent,
         ExchangeJobRequestsComponent, ExchangeListComponent, DeleteExchangeModalComponent,
         ExchangeAccessRequestInfoComponent, CompanyExchangeInvitationInfoComponent,
         ExchangeJobRequestInfoComponent, ExchangeJobAssociationUtilityPageComponent,
         DenyRequestModalComponent, ApproveRequestModalComponent, ManageExchangeFiltersComponent,
         TagCategoriesPageComponent, CreateTagCategoryModalComponent, TagCategoriesListComponent,
         AddTagCategoriesModalComponent, ToggleExchangeStatusConfirmationModalComponent } from './containers';

import {
  ExchangeListEffects, ExchangeCompaniesEffects, AvailableCompaniesEffects,
  ManageExchangeEffects, ExchangeJobsEffects, AvailableJobsEffects, ExchangeAccessRequestsEffects,
  PayfactorsCompanyExchangeInvitationsEffects, NewCompanyExchangeInvitationsEffects, ExchangeJobRequestsEffects,
  CompanyExchangeInvitationInfoEffects, ExchangeFiltersEffects, TagCategoriesEffects
} from './effects';
import { ExchangeJobAssociationUtilityEffects } from './effects/exchange-job-association-utility.effects';
import { ExchangeExistsGuard } from './guards';
import { reducers } from './reducers';
import { GridHelperService } from './services';
import { PeerAdminRoutingModule } from './peer-admin-routing.module';
import { AddCompaniesModalComponent } from './containers/add-companies-modal';
import { AddJobsModalComponent } from './containers/add-jobs-modal';
import { DeleteCompanyModalComponent } from './containers/delete-company-modal';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    GridModule,
    LayoutModule,
    StoreModule.forFeature('peerAdmin', reducers),
    EffectsModule.forFeature([
      ExchangeListEffects,
      ExchangeCompaniesEffects,
      ManageExchangeEffects,
      AvailableCompaniesEffects,
      ExchangeJobsEffects,
      AvailableJobsEffects,
      ExchangeAccessRequestsEffects,
      PayfactorsCompanyExchangeInvitationsEffects,
      NewCompanyExchangeInvitationsEffects,
      ExchangeJobRequestsEffects,
      CompanyExchangeInvitationInfoEffects,
      ExchangeJobAssociationUtilityEffects,
      ExchangeFiltersEffects,
      TagCategoriesEffects
    ]),
    DropDownsModule,
    SwitchModule,
    DragDropModule,

    // Routing
    PeerAdminRoutingModule,

    // Payfactors
    PfKendoExtensions,
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
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
    ExchangeAccessRequestsComponent,
    PayfactorsCompanyExchangeInvitationsComponent,
    NewCompanyExchangeInvitationsComponent,
    ExchangeJobRequestsComponent,
    DeleteCompanyModalComponent,
    ExchangeListComponent,
    DeleteExchangeModalComponent,
    ExchangeAccessRequestInfoComponent,
    CompanyExchangeInvitationInfoComponent,
    ExchangeJobRequestInfoComponent,
    DenyRequestModalComponent,
    ApproveRequestModalComponent,
    ManageExchangeFiltersComponent,
    TagCategoriesPageComponent,
    CreateTagCategoryModalComponent,
    ToggleExchangeStatusConfirmationModalComponent,
    TagCategoriesListComponent,
    AddTagCategoriesModalComponent,

    // Pages
    ExchangeListPageComponent,
    ManageExchangePageComponent,
    ExchangeJobAssociationUtilityPageComponent
  ],
  providers: [
    // Guards
    ExchangeExistsGuard,

    // Services
    GridHelperService
  ]
})
export class PeerAdminModule { }
