import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { NgbAlertModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { UploadModule } from '@progress/kendo-angular-upload';

import { PfCommonModule } from 'libs/core';
import { PfCompanySelectorModule } from 'libs/features/company/company-selector.module';
import { FieldMapperComponent } from 'libs/features/org-data-loader/components';
import { LoaderSettingsEffects } from 'libs/features/org-data-loader/state/effects/loader-settings.effects';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { EntityPickerComponent, EntityUploadComponent, FileMappingComponent } from './components';
import { FileUploadComponent } from './components/file-upload';
import {
    DataAlertsPageComponent, DataManagementHomePageComponent, DataManagementSidebarComponent, EntityMappingComponent,
    FieldMappingCardComponent, HrisAuthenticationCardComponent, ManageDataPageComponent, OrgDataLoadComponent,
    PfTestAuthenticationComponent, ProviderCardComponent, TransferDataPageComponent, TransferMethodDropdownComponent,
    WorkdayAuthenticationComponent, WorkdayMockAuthenticationComponent
} from './containers';
import {
    FieldMappingEffects, FileUploadEffects, OrganizationalDataPageEffects, OrgDataFieldMappingsEffects, TransferDataPageEffects
} from './effects';
import * as fromFaIcons from './fa-icons';
import { MainRoutingModule } from './main-routing.module';
import { reducers } from './reducers';

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

    StoreModule.forFeature('data_management', reducers),
    EffectsModule.forFeature([
      TransferDataPageEffects,
      OrganizationalDataPageEffects,
      FieldMappingEffects,
      OrgDataFieldMappingsEffects,
      FileUploadEffects,
      LoaderSettingsEffects
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
    PfCompanySelectorModule
  ],
  declarations: [
    // Pages
    DataManagementHomePageComponent,
    TransferDataPageComponent,
    ManageDataPageComponent,
    DataAlertsPageComponent,

    // Components
    DataManagementSidebarComponent,
    TransferMethodDropdownComponent,
    ProviderCardComponent,
    HrisAuthenticationCardComponent,
    WorkdayAuthenticationComponent,
    WorkdayMockAuthenticationComponent,
    PfTestAuthenticationComponent,
    OrgDataLoadComponent,
    EntityPickerComponent,
    EntityUploadComponent,
    FieldMappingCardComponent,
    FileUploadComponent,
    EntityMappingComponent,
    FieldMapperComponent,
    FileMappingComponent
  ]
})
export class MainModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
