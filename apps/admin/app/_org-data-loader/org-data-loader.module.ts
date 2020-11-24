import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FileSelectModule, UploadModule } from '@progress/kendo-angular-upload';

import { PfCompanySelectorModule } from 'libs/features/company/company-selector/company-selector.module';
import { PfCustomFieldsModule } from 'libs/features/company/custom-fields/custom-fields.module';
import { PfEntityIdentifierModule } from 'libs/features/company/entity-identifier/entity-identifier.module';
import { PfEmailRecipientsModule } from 'libs/features/loader-email-reipients';
import { PfFieldMapperModule } from 'libs/features/org-data-loader';
import { LoaderSettingsEffects } from 'libs/features/org-data-loader/state/effects/loader-settings.effects';
import { PfFormsModule } from 'libs/forms';
import { ConfigSettingsSelectorFactory } from 'libs/state/app-context/services';
import { PfCommonUIModule } from 'libs/ui/common';

import * as fromFaIcons from './fa-icons';
import { OrgDataLoaderRoutingModule } from './org-data-loader-routing.module';
import { ManageFieldMappingsPageComponent } from './containers/pages';
import { reducers } from './reducers';
import {
    CompanySelectorEffects, LoaderConfigurationGroupsEffects, OrgDataConfigurationEffects, OrgDataFieldMappingsEffects, SftpUserEffects
} from './effects';
import { PublicKeyAuthComponent, SftpAccountStatusComponent } from './containers';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropDownsModule,

    // 3rd Party
    StoreModule.forFeature('orgDataLoader', reducers),
    EffectsModule.forFeature([
      CompanySelectorEffects,
      OrgDataFieldMappingsEffects,
      LoaderSettingsEffects,
      LoaderConfigurationGroupsEffects,
      OrgDataConfigurationEffects,
      SftpUserEffects
    ]),

    // 3rd Party
    LayoutModule,
    UploadModule,
    FontAwesomeModule,
    NgbTooltipModule,
    FileSelectModule,

    // Routing
    OrgDataLoaderRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    PfFieldMapperModule,
    PfEmailRecipientsModule,
    PfCompanySelectorModule,
    PfEntityIdentifierModule,
    PfCustomFieldsModule
  ],
  providers: [
    ConfigSettingsSelectorFactory
  ],
  declarations: [
    // Components
    SftpAccountStatusComponent,
    PublicKeyAuthComponent,

    // Pages
    ManageFieldMappingsPageComponent
  ]
})
export class OrgDataLoaderModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
