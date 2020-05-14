import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadModule } from '@progress/kendo-angular-upload';
import { GridModule } from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';

import { PfKendoExtensions } from 'libs/extensions';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';
import { JobAssociationMatchModule } from 'libs/features/peer/job-association-match';

import { CompanyJobMapResultComponent, JobInfoContainerComponent, ApplyMappingButtonComponent } from './components';
import {
  ExchangeJobMappingPageComponent, ExchangeJobMappingInfoComponent, ExchangeJobMappingGridComponent,
  PayfactorsJobSelectionFormComponent, DeleteMappingConfirmationModalComponent
} from './containers';
import {
  ExchangeJobMappingGridEffects, ExchangeJobMappingInfoEffects, PayfactorsJobExchangeRequestEffects, CompanyJobsEffects,
  ExchangeEffects
} from './effects';
import { reducers } from './reducers';
import { ExchangeJobMappingService, } from './services';
import { ManageRoutingModule } from './manage-routing.module';
import { RequestJobModalComponent } from './containers/request-job/request-job-modal';
import { NewJobFormComponent } from './containers/request-job/new-job-form';
import { BoolFilterComponent } from 'libs/extensions/kendo/boolfilter/bool-filter.component';
import {
  AssociationImportModalComponent
} from './containers/association-import-modal/association-import-modal.component';
import { CompanyJobsGridComponent } from './containers/company-jobs-grid/company-jobs-grid.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import * as fromFaIcons from './fa-icons';
import {
  CompanyJobAndExchangeDetailComponent
} from './containers/company-job-and-exchange-detail/company-job-and-exchange-detail.component';
import { CompanyJobDetailComponent } from './components/company-job-detail/company-job-detail.component';
import { ExchangeDetailComponent } from './components/exchange-job-detail/exchange-job-detail.component';
import { ExchangeJobSearchComponent } from './containers/exchange-job-search/exchange-job-search.component';
import { UnmatchIconComponent } from './components/unmatch-icon/unmatch-icon.component';
import { ConfirmUnmatchModalComponent } from './containers/confirm-unmatch-modal/confirm-unmatch-modal.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // 3rd party
    GridModule,
    StoreModule.forFeature('peer_manage', reducers),
    EffectsModule.forFeature([
      ExchangeJobMappingGridEffects, ExchangeJobMappingInfoEffects, PayfactorsJobExchangeRequestEffects, CompanyJobsEffects,
      ExchangeEffects
    ]),
    DropDownsModule,
    NgbCarouselModule,
    UploadModule,
    TooltipModule,
    FontAwesomeModule,
    JobAssociationMatchModule,

    // Routing
    ManageRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    PfKendoExtensions,
    PfCommonModule,
    SharedModule
  ],
  declarations: [
    // Components
    CompanyJobMapResultComponent, JobInfoContainerComponent, ApplyMappingButtonComponent, CompanyJobDetailComponent,
    ExchangeDetailComponent, UnmatchIconComponent,

    // Containers
    ExchangeJobMappingGridComponent, ExchangeJobMappingInfoComponent, PayfactorsJobSelectionFormComponent,
    RequestJobModalComponent, NewJobFormComponent, DeleteMappingConfirmationModalComponent,
    AssociationImportModalComponent, CompanyJobsGridComponent, CompanyJobAndExchangeDetailComponent,
    ExchangeJobSearchComponent, ConfirmUnmatchModalComponent,

    // Pages
    ExchangeJobMappingPageComponent,
    BoolFilterComponent,
  ],
  providers: [
    ExchangeJobMappingService
  ]
})
export class ManageModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
