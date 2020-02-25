import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { UploadModule } from '@progress/kendo-angular-upload';

import { PfCommonModule } from 'libs/core';
import { PfCompanySelectorModule } from 'libs/features/company/company-selector.module';
import { PfEmailRecipientsModule } from 'libs/features/loader-email-reipients';
import { PfFieldMapperModule } from 'libs/features/org-data-loader';
import { LoaderSettingsEffects } from 'libs/features/org-data-loader/state/effects/loader-settings.effects';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import {
  DefaultPaymarketConfirmationModalComponent,
  EntityPickerComponent,
  EntityUploadComponent,
  FileMappingComponent,
  PfCheckboxComponent,
} from './components';
import { FileUploadComponent } from './components/file-upload';
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
  OutboundAuthenticationPageComponent,
  OutboundEntitySelectionPageComponent,
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
  FileUploadEffects,
  HrisConnectionEffects,
  OrganizationalDataPageEffects,
  OrgDataFieldMappingsEffects,
  OutboundJdmEffects,
  TransferDataPageEffects,
  TransferScheduleEffects,
} from './effects';
import * as fromFaIcons from './fa-icons';
import { MainRoutingModule } from './main-routing.module';
import { reducers } from './reducers';
import { GetSupportedSchedulesPipe } from './pipes';

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
      FileUploadEffects,
      HrisConnectionEffects,
      OrganizationalDataPageEffects,
      OrgDataFieldMappingsEffects,
      OutboundJdmEffects,
      TransferDataPageEffects,
      TransferScheduleEffects,
    ]),
    FontAwesomeModule,
    NgbTabsetModule,
    NgbTooltipModule,
    NgbAlertModule,
    UploadModule,
    LayoutModule,

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
    GetSupportedSchedulesPipe,

    // Pages
    DataManagementHomePageComponent,
    DataManagementLandingPageComponent,
    FieldMappingPageComponent,
    InboundAuthenticationPageComponent,
    InboundEntitySelectionPageComponent,
    OutboundAuthenticationPageComponent,
    OutboundEntitySelectionPageComponent,
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
    FileUploadComponent,
    FieldMappingCardComponent,
    HrisAuthenticationCardComponent,
    HrisIntegrationPanelComponent,
    HrisIntegrationSidebarComponent,
    HrisIntegrationStatusComponent,
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
    FieldMappingPageComponent,
    OutboundProviderSelectionPageComponent,
    OutboundEntitySelectionPageComponent,
    OutboundFieldMappingPageComponent,
    OutboundAuthenticationPageComponent,
    OutboundTransferSchedulePageComponent,
    OutboundJdmViewSelectionPageComponent,
    OutboundTransferScheduleSummaryComponent
  ]
})
export class MainModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
