import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { UploadModule } from '@progress/kendo-angular-upload';

import { EntityKeyValidationService, PfCommonModule } from 'libs/core';
import { PfBulkExportSchedulerModule, PfNavigationLinksModule } from 'libs/features';
import { PfCompanySelectorModule } from 'libs/features/company/company-selector/company-selector.module';
import { PfCustomFieldsModule } from 'libs/features/company/custom-fields/custom-fields.module';
import { PfEntityIdentifierModule } from 'libs/features/company/entity-identifier/entity-identifier.module';
import { JobDescriptionExportEffects } from 'libs/features/jobs/job-description-management/effects/job-description-export.effects';
import { PfEmailRecipientsModule } from 'libs/features/loaders/loader-email-recipients';
import { PfFieldMapperModule } from 'libs/features/loaders/org-data-loader';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import {
    AuthenticationStatusComponent, DateConverterFormComponent, DateFormatDropDownComponent, DefaultPaymarketConfirmationModalComponent,
    EntityPickerComponent, EntityUploadComponent, FileMappingComponent, IntegrationCompleteModalComponent, LatestOrgDataLoadModalComponent,
    PfCheckboxComponent, ProviderListComponent
} from './components';
import {
    CustomEmployeeIdentifierComponent, DataConverterModalComponent, DataManagementHomePageComponent, DataManagementLandingPageComponent,
    EntityFieldSelectionComponent, EntityMappingComponent, FieldMappingCardComponent, FieldMappingPageComponent,
    FieldSelectionCardComponent, HrisAuthenticationCardComponent, HrisIntegrationPanelComponent, HrisIntegrationSidebarComponent,
    HrisIntegrationStatusComponent, HrisReAuthenticationModalComponent, InboundAuthenticationPageComponent,
    InboundEntitySelectionPageComponent, InboundProvidersPageComponent, LoadAndExportFilesCardComponent, OrgDataLoadComponent,
    OutboundAuthenticationPageComponent, OutboundBulkJobsExportSchedulerPageComponent, OutboundFieldMappingPageComponent,
    OutboundJdmViewSelectionPageComponent, OutboundProviderSelectionPageComponent, OutboundTransferSchedulePageComponent,
    OutboundTransferScheduleSummaryComponent, PfTestAuthenticationComponent, ProviderCardComponent, PublicApiAuthenticationComponent,
    ResetIntegrationPageComponent, TransferDataPageComponent, TransferMethodDropdownComponent, TransferScheduleCardComponent,
    TransferScheduleCronComponent, TransferSchedulePageComponent, TransferScheduleSummaryComponent, WorkdayAuthenticationComponent,
    WorkdayMockAuthenticationComponent, WorkdayRestAuthenticationComponent
} from './containers';
import {
    ConverterSettingsEffects, EntitySelectionEffects, FieldMappingEffects, HrisConnectionEffects, LoadAndExportFilesCardEffects,
    LoadersDataEffects, OnDemandSyncEffects, OrganizationalDataPageEffects, OrgDataFieldMappingsEffects, OutboundJdmEffects,
    ProviderListEffects, TransferDataPageEffects, TransferScheduleEffects
} from './effects';
import * as fromFaIcons from './fa-icons';
import { MainRoutingModule } from './main-routing.module';
import { reducers } from './reducers';
import { GetSupportedSchedulesPipe, OrgDataEntityTypeToDisplayName } from './pipes';
import { HrisAuthenticationGuard } from './guards';

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
      EntitySelectionEffects,
      FieldMappingEffects,
      HrisConnectionEffects,
      OnDemandSyncEffects,
      OrganizationalDataPageEffects,
      OrgDataFieldMappingsEffects,
      OutboundJdmEffects,
      TransferDataPageEffects,
      TransferScheduleEffects,
      ProviderListEffects,
      ConverterSettingsEffects,
      LoadersDataEffects,
      JobDescriptionExportEffects,
      LoadAndExportFilesCardEffects
    ]),
    FontAwesomeModule,
    NgbDropdownModule,
    NgbTabsetModule,
    NgbTooltipModule,
    NgbAlertModule,
    UploadModule,
    LayoutModule,
    SwitchModule,
    GridModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfCompanySelectorModule,
    PfFieldMapperModule,
    PfEmailRecipientsModule,
    PfNavigationLinksModule,
    PfBulkExportSchedulerModule,
    PfEntityIdentifierModule,
    PfCustomFieldsModule
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
    OutboundBulkJobsExportSchedulerPageComponent,

    // Components
    AuthenticationStatusComponent,
    CustomEmployeeIdentifierComponent,
    DefaultPaymarketConfirmationModalComponent,
    IntegrationCompleteModalComponent,
    EntityPickerComponent,
    EntityUploadComponent,
    EntityMappingComponent,
    EntityFieldSelectionComponent,
    FileMappingComponent,
    FieldMappingCardComponent,
    FieldSelectionCardComponent,
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
    PublicApiAuthenticationComponent,
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
    ProviderListComponent,
    FieldSelectionCardComponent,
    DateConverterFormComponent,
    DataConverterModalComponent,
    DateFormatDropDownComponent,
    LoadAndExportFilesCardComponent,
    LatestOrgDataLoadModalComponent,
  ],
  providers: [
    // Guards
    HrisAuthenticationGuard,
    EntityKeyValidationService
  ]
})
export class MainModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
