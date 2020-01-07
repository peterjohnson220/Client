import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { UploadModule } from '@progress/kendo-angular-upload';

import { LoaderSettingsEffects } from 'libs/features/org-data-loader/state/effects/loader-settings.effects';
import { PfFormsModule } from 'libs/forms';
import { ConfigSettingsSelectorFactory } from 'libs/state/app-context/services';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFieldMapperModule } from 'libs/features/org-data-loader';

import * as fromFaIcons from './fa-icons';
import { OrgDataLoaderRoutingModule } from './org-data-loader-routing.module';
import { ManageFieldMappingsPageComponent } from './containers/pages';
import { reducers } from './reducers';
import { CompanySelectorEffects, OrgDataEmailRecipientsEffects, OrgDataFieldMappingsEffects } from './effects';
import { CompanySelectorComponent, EmailRecipientsComponent, SftpAccountStatusComponent } from './containers';

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
    PfFormsModule,
    PfFieldMapperModule
  ],
  providers: [
    ConfigSettingsSelectorFactory
  ],
  declarations: [
    // Components
    SftpAccountStatusComponent,
    CompanySelectorComponent,
    EmailRecipientsComponent,

    // Pages
    ManageFieldMappingsPageComponent
  ]
})
export class OrgDataLoaderModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
