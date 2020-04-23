import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { WindowCommunicationService } from 'libs/core/services';
import {PfPeerMapModule, ExchangeSelectorComponent, ExchangeJobSelectorComponent} from 'libs/features/peer/';
import { CompanyJobApiService } from 'libs/data/payfactors-api/';
import { PfCommonModule } from 'libs/core';
import { PfExchangeExplorerModule } from 'libs/features/peer/exchange-explorer';
import { GuidelinesBadgeModule } from 'libs/features/peer/guidelines-badge/guidelines-badge.module';
import { DojGuidelinesService } from 'libs/features/peer/guidelines-badge/services/doj-guidelines.service';
import { DataCutValidationEffects } from 'libs/features/peer/guidelines-badge/effects';

import * as fromFaIcons from './fa-icons';
import {
  JobInfoContainerComponent, CompanyJobMapResultComponent,
  ApplyMappingButtonComponent
} from './../../../peer/app/_manage/components';
import {
  AssociateCompanyJobComponent, PaymarketExchangeScopeComponent, UpsertDataCutPageComponent,
  TaggingEntitiesPageComponent, UpsertDataCutNewPageComponent
} from './containers';
import { PeerRoutingModule } from './peer-routing.module';
import {
  AssociateCompanyJobEffects, PaymarketExchangeScopeEffects,
  RequestPeerAccessEffects, UpsertDataCutPageEffects, TaggingEntitiesEffects
} from './effects';
import { reducers } from './reducers';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GuidelinesBadgeModule,

    // 3rd party
    StoreModule.forFeature('legacy_upsertPeerData', reducers),
    EffectsModule.forFeature([
      AssociateCompanyJobEffects,
      DataCutValidationEffects,
      PaymarketExchangeScopeEffects,
      UpsertDataCutPageEffects,
      RequestPeerAccessEffects,
      TaggingEntitiesEffects
    ]),
    NgbPopoverModule,
    NgbTooltipModule,
    DropDownsModule,
    FontAwesomeModule,

    // Routing
    PeerRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfCommonModule,
    PfFormsModule,
    PfPeerMapModule,
    PfExchangeExplorerModule
  ],
  declarations: [
    // Components
    JobInfoContainerComponent,
    ExchangeSelectorComponent,
    CompanyJobMapResultComponent,
    ApplyMappingButtonComponent,

    // Pages
    AssociateCompanyJobComponent,
    PaymarketExchangeScopeComponent,
    UpsertDataCutPageComponent,
    TaggingEntitiesPageComponent,
    UpsertDataCutNewPageComponent
  ],
  exports: [
    ExchangeJobSelectorComponent
  ],
  providers: [
    WindowCommunicationService, DojGuidelinesService, CompanyJobApiService
  ]
})
export class PeerModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
