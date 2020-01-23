import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DragulaModule } from 'ng2-dragula';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { UploadModule } from '@progress/kendo-angular-upload';

import { PfCommonModule } from 'libs/core';
import { PfCompanySelectorModule } from 'libs/features/company/company-selector.module';
import { LoaderSettingsEffects } from 'libs/features/org-data-loader/state/effects/loader-settings.effects';
import { PfFieldMapperModule } from 'libs/features/org-data-loader';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfEmailRecipientsModule } from 'libs/features/loader-email-reipients';

import {
  EntityPickerComponent,
  EntityUploadComponent,
  FileMappingComponent,
  DefaultPaymarketConfirmationModalComponent,
} from './components';
import { FileUploadComponent } from './components/file-upload';
import {
  DataManagementHomePageComponent, EntityMappingComponent,
  FieldMappingCardComponent, HrisAuthenticationCardComponent, OrgDataLoadComponent,
  PfTestAuthenticationComponent, ProviderCardComponent, TransferDataPageComponent, TransferMethodDropdownComponent,
  WorkdayAuthenticationComponent, WorkdayMockAuthenticationComponent, WorkdayRestAuthenticationComponent,
  TransferSchedulePageComponent, TransferScheduleSummaryComponent, TransferScheduleCardComponent,
  TransferScheduleCronComponent, DataManagementLandingPageComponent, HrisIntegrationPanelComponent,
  HrisIntegrationStatusComponent, HrisIntegrationSidebarComponent, ResetIntegrationPageComponent,
} from './containers';
import {
  FieldMappingEffects, OrganizationalDataPageEffects, OrgDataFieldMappingsEffects, TransferDataPageEffects,
  FileUploadEffects, CustomFieldsEffect, TransferScheduleEffects, HrisConnectionEffects
} from './effects';
import * as fromFaIcons from './fa-icons';
import { MainRoutingModule } from './main-routing.module';
import { reducers } from './reducers';
import {GetSupportedSchedulesPipe} from './pipes';

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
      TransferDataPageEffects,
      OrganizationalDataPageEffects,
      FieldMappingEffects,
      OrgDataFieldMappingsEffects,
      FileUploadEffects,
      LoaderSettingsEffects,
      CustomFieldsEffect,
      TransferScheduleEffects,
      HrisConnectionEffects
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
    TransferDataPageComponent,

    // Components
    TransferMethodDropdownComponent,
    ProviderCardComponent,
    HrisAuthenticationCardComponent,
    WorkdayAuthenticationComponent,
    WorkdayMockAuthenticationComponent,
    WorkdayRestAuthenticationComponent,
    PfTestAuthenticationComponent,
    OrgDataLoadComponent,
    EntityPickerComponent,
    EntityUploadComponent,
    FieldMappingCardComponent,
    FileUploadComponent,
    EntityMappingComponent,
    FileMappingComponent,
    TransferSchedulePageComponent,
    TransferScheduleSummaryComponent,
    TransferScheduleCardComponent,
    TransferScheduleCronComponent,
    DataManagementLandingPageComponent,
    HrisIntegrationPanelComponent,
    HrisIntegrationStatusComponent,
    HrisIntegrationSidebarComponent,
    ResetIntegrationPageComponent,
    DefaultPaymarketConfirmationModalComponent,
  ]
})
export class MainModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
