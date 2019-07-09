import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutModule } from '@progress/kendo-angular-layout';
import { EffectsModule } from '@ngrx/effects';
import { UploadModule } from '@progress/kendo-angular-upload';
import { StoreModule } from '@ngrx/store';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { ConfigSettingsSelectorFactory } from 'libs/state/app-context/services';
import * as fromFaIcons from './fa-icons';

import { OrgDataLoaderRoutingModule } from './org-data-loader-routing.module';
import { ManageFieldMappingsPageComponent } from './containers/pages';
import { FieldMapperComponent } from './containers/field-mapper/field-mapper.component';
import { reducers } from './reducers';
import { CompanySelectorEffects } from './effects/company-selector.effects';
import { CompanySelectorComponent } from './containers/company-selector/company-selector.component';
import { OrgDataFieldMappingsEffects } from './effects/org-data-field-mappings.effects';
import { EmailRecipientsComponent } from './containers/email-recipients/email-recipients.component';
import { OrgDataEmailRecipientsEffects } from './effects/email-recipients.effects';
import { LoaderSettingsEffects } from './effects/loader-settings.effects';
import { SftpAccountStatusComponent } from './containers/sftp-account-status/sftp-account-status.component';


@NgModule({
  imports:      [
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
      OrgDataEmailRecipientsEffects,
      LoaderSettingsEffects]),

    // 3rd Party
    LayoutModule,
    UploadModule,
    FontAwesomeModule,

    // Routing
    OrgDataLoaderRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule
  ],
  providers: [
    ConfigSettingsSelectorFactory
  ],
  declarations: [
    // Components
    SftpAccountStatusComponent,
    FieldMapperComponent,
    CompanySelectorComponent,
    EmailRecipientsComponent,

    // Pages
    ManageFieldMappingsPageComponent
  ]
})
export class OrgDataLoaderModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
