import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule, NgbTabsetModule, NgbTooltipModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { UploadModule } from '@progress/kendo-angular-upload';
import { SwitchModule } from '@progress/kendo-angular-inputs';

import { PfCommonModule } from 'libs/core';
import { PfCompanySelectorModule } from 'libs/features/company/company-selector/company-selector.module';
import { PfEmailRecipientsModule } from 'libs/features/loader-email-reipients';
import { PfFieldMapperModule } from 'libs/features/org-data-loader';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import {
  DefaultPaymarketConfirmationModalComponent,
  EntityPickerComponent,
  EntityUploadComponent,
  FileMappingComponent,
  PfCheckboxComponent,
  ProviderListComponent
} from './components';
import {
  CustomEmployeeIdentifierComponent,
  DataManagementHomePageComponent,
  DataManagementLandingPageComponent,
  EntityMappingComponent,
  FieldMappingPageComponent,
  FieldMappingCardComponent,
  HrisAuthenticationCardComponent,
  HrisIntegrationPanelComponent,
  HrisIntegrationSidebarComponent,
  HrisIntegrationStatusComponent,
  HrisReAuthenticationModalComponent,
  OrgDataLoadComponent,
  PfTestAuthenticationComponent,
  ProviderCardComponent,
  ResetIntegrationPageComponent,
  TransferDataPageComponent,
  TransferMethodDropdownComponent,
  TransferScheduleCardComponent,
  TransferScheduleCronComponent,
  TransferSchedulePageComponent,
  TransferScheduleSummaryComponent,
  WorkdayAuthenticationComponent,
  WorkdayMockAuthenticationComponent,
  WorkdayRestAuthenticationComponent,
  InboundEntitySelectionPageComponent,
  InboundAuthenticationPageComponent,
  InboundProvidersPageComponent,
  OutboundAuthenticationPageComponent,
  OutboundFieldMappingPageComponent,
  OutboundJdmViewSelectionPageComponent,
  OutboundProviderSelectionPageComponent,
  OutboundTransferSchedulePageComponent,
  OutboundTransferScheduleSummaryComponent
} from './containers';
import {
  CustomFieldsEffect,
  EntityIdentifiersEffects,
  EntitySelectionEffects,
  FieldMappingEffects,
  HrisConnectionEffects,
  OnDemandSyncEffects,
  OrganizationalDataPageEffects,
  OrgDataFieldMappingsEffects,
  OutboundJdmEffects,
  TransferDataPageEffects,
  TransferScheduleEffects,
  ProviderListEffects
} from './effects';
import * as fromFaIcons from './fa-icons';
import { MainRoutingModule } from './main-routing.module';
import { reducers } from './reducers';
import { GetSupportedSchedulesPipe, OrgDataEntityTypeToDisplayName } from './pipes';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropDownsModule,

    // Routing
    MainRoutingModule,

    // 3rd Party
    DragulaModule.forRoot(),
    StoreModule.forFeature('data_management', reducers),
    EffectsModule.forFeature([
      CustomFieldsEffect,
      EntityIdentifiersEffects,
      EntitySelectionEffects,
      FieldMappingEffects,
      HrisConnectionEffects,
      OnDemandSyncEffects,
      OrganizationalDataPageEffects,
      OrgDataFieldMappingsEffects,
      OutboundJdmEffects,
      TransferDataPageEffects,
      TransferScheduleEffects,
      EntityIdentifiersEffects,
      EntitySelectionEffects,
      ProviderListEffects
    ]),
    FontAwesomeModule,
    NgbDropdownModule,
    NgbTabsetModule,
    NgbTooltipModule,
    NgbAlertModule,
    UploadModule,
    LayoutModule,
    SwitchModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfCompanySelectorModule,
    PfFieldMapperModule,
    PfEmailRecipientsModule
  ],
  declarations: [
    // Pipes
    OrgDataEntityTypeToDisplayName,
    GetSupportedSchedulesPipe,

    // Pages
    DataManagementHomePageComponent,
    DataManagementLandingPageComponent,
    FieldMappingPageComponent,
    InboundAuthenticationPageComponent,
    InboundEntitySelectionPageComponent,
    OutboundAuthenticationPageComponent,
    OutboundFieldMappingPageComponent,
    OutboundJdmViewSelectionPageComponent,
    OutboundProviderSelectionPageComponent,
    OutboundTransferSchedulePageComponent,
    ResetIntegrationPageComponent,
    TransferDataPageComponent,
    TransferSchedulePageComponent,

    // Components
    CustomEmployeeIdentifierComponent,
    DefaultPaymarketConfirmationModalComponent,
    EntityPickerComponent,
    EntityUploadComponent,
    EntityMappingComponent,
    FileMappingComponent,
    FieldMappingCardComponent,
    HrisAuthenticationCardComponent,
    HrisIntegrationPanelComponent,
    HrisIntegrationSidebarComponent,
    HrisIntegrationStatusComponent,
    HrisReAuthenticationModalComponent,
    OrgDataLoadComponent,
    PfCheckboxComponent,
    PfTestAuthenticationComponent,
    ProviderCardComponent,
    TransferMethodDropdownComponent,
    TransferScheduleSummaryComponent,
    TransferScheduleCardComponent,
    TransferScheduleCronComponent,
    WorkdayAuthenticationComponent,
    WorkdayMockAuthenticationComponent,
    WorkdayRestAuthenticationComponent,
    DataManagementLandingPageComponent,
    HrisIntegrationPanelComponent,
    HrisIntegrationStatusComponent,
    HrisIntegrationSidebarComponent,
    ResetIntegrationPageComponent,
    DefaultPaymarketConfirmationModalComponent,
    CustomEmployeeIdentifierComponent,
    PfCheckboxComponent,
    InboundEntitySelectionPageComponent,
    InboundAuthenticationPageComponent,
    InboundProvidersPageComponent,
    FieldMappingPageComponent,
    OutboundProviderSelectionPageComponent,
    OutboundFieldMappingPageComponent,
    OutboundAuthenticationPageComponent,
    OutboundTransferSchedulePageComponent,
    OutboundJdmViewSelectionPageComponent,
    OutboundTransferScheduleSummaryComponent,
    ProviderListComponent
  ]
})
export class MainModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
