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

import { reducers } from './reducers';
import { CompanySelectorEffects } from './effects';
import { CompanySelectorComponent } from './containers';
import { OrgDataFieldMappingsEffects } from './effects';
import { EmailRecipientsComponent } from './containers';
import { OrgDataEmailRecipientsEffects } from './effects';
import { LoaderSettingsEffects } from './effects';
import { SftpAccountStatusComponent } from './containers';
import {FieldMapperComponent} from 'libs/features/org-data-loader/components';


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
