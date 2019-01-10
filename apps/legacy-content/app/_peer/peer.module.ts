import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { WindowCommunicationService } from 'libs/core/services';
import { PfPeerMapModule, ExchangeSelectorComponent } from 'libs/features/peer/';
import { CompanyJobApiService } from 'libs/data/payfactors-api/';
import { PfCommonModule } from 'libs/core';

import {
  JobInfoContainerComponent, CompanyJobMapResultComponent,
  ApplyMappingButtonComponent
} from './../../../peer/app/_manage/components';
import {
  AssociateCompanyJobComponent, PaymarketExchangeScopeComponent, UpsertDataCutPageComponent
} from './containers';
import { PeerRoutingModule } from './peer-routing.module';
import {
  AssociateCompanyJobEffects, DataCutValidationEffects, PaymarketExchangeScopeEffects, UpsertDataCutPageEffects
} from './effects';
import { reducers } from './reducers';
import { GuidelinesBadgeComponent } from './components';
import { DojGuidelinesService } from './services/doj-guidelines.service';



@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd party
    StoreModule.forFeature('legacy_upsertPeerData', reducers),
    EffectsModule.forFeature([
      AssociateCompanyJobEffects,
      DataCutValidationEffects,
      PaymarketExchangeScopeEffects,
      UpsertDataCutPageEffects,
    ]),
    NgbPopoverModule,
    DropDownsModule,

    // Routing
    PeerRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfCommonModule,
    PfFormsModule,
    PfPeerMapModule
  ],
  declarations: [
    // Components
    GuidelinesBadgeComponent,
    JobInfoContainerComponent,
    ExchangeSelectorComponent,
    CompanyJobMapResultComponent,
    ApplyMappingButtonComponent,

    // Pages
    AssociateCompanyJobComponent,
    PaymarketExchangeScopeComponent,
    UpsertDataCutPageComponent

    // pipe
  ],
  providers: [
    WindowCommunicationService, DojGuidelinesService, CompanyJobApiService
  ]
})
export class PeerModule { }
