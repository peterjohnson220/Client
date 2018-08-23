import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { PfKendoExtensions } from 'libs/extensions';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';

import { CompanyJobMapResultComponent, JobInfoContainerComponent, ApplyMappingButtonComponent } from './components';
import {
  ExchangeJobMappingPageComponent, ExchangeJobMappingInfoComponent, ExchangeJobMappingGridComponent,
  PayfactorsJobSelectionFormComponent, DeleteMappingConfirmationModalComponent
} from './containers';
import { ExchangeJobMappingGridEffects, ExchangeJobMappingInfoEffects, PayfactorsJobExchangeRequestEffects } from './effects';
import { reducers } from './reducers';
import { ExchangeJobMappingService, } from './services';
import { ManageRoutingModule } from './manage-routing.module';
import { RequestJobModalComponent } from './containers/request-job/request-job-modal';
import { NewJobFormComponent } from './containers/request-job/new-job-form';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd party
    GridModule,
    StoreModule.forFeature('peer_manage', reducers),
    EffectsModule.forFeature([
      ExchangeJobMappingGridEffects, ExchangeJobMappingInfoEffects, PayfactorsJobExchangeRequestEffects
    ]),
    DropDownsModule,
    NgbCarouselModule,

    // Routing
    ManageRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    PfKendoExtensions,
    PfCommonModule
  ],
  declarations: [
    // Components
    CompanyJobMapResultComponent, JobInfoContainerComponent, ApplyMappingButtonComponent,

    // Containers
    ExchangeJobMappingGridComponent, ExchangeJobMappingInfoComponent, PayfactorsJobSelectionFormComponent,
    RequestJobModalComponent, NewJobFormComponent, DeleteMappingConfirmationModalComponent,

    // Pages
    ExchangeJobMappingPageComponent
  ],
  providers: [
    ExchangeJobMappingService
  ]
})
export class ManageModule { }
