import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import {
  MyProfileComponent,
  DashboardPreferencesComponent,
  PersonalProjectSettingsComponent,
  AutoShareComponent,
  PayMarketDefaultSettingsComponent,
  PayMarketCutComponent,
  ProjectTemplatesComponent,
  UserProfileComponent
} from './containers';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';

import {
  DashboardPreferencesEffects,
  UserProfileEffects,
  ProjectTemplateEffects,
  PayMarketDefaultSettingsEffects
} from './effects';
import { UserSettingsPageComponent } from './user-settings.page';
import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { PfUserSettingsModule } from '../../../../libs/features/user-settings';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Routing
    UserSettingsRoutingModule,

    // 3rd party
    StoreModule.forFeature('userSettings_main', reducers),
    EffectsModule.forFeature([
      DashboardPreferencesEffects,
      UserProfileEffects,
      ProjectTemplateEffects,
      PayMarketDefaultSettingsEffects
    ]),
    FontAwesomeModule,
    NgbPopoverModule,
    NgbModule,
    ImgFallbackModule,
    UploadsModule,
    DropDownsModule,
    GridModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfUserSettingsModule
  ],
  declarations: [
    // Pages
    UserSettingsPageComponent,

    // Containers
    MyProfileComponent,
    DashboardPreferencesComponent,
    PersonalProjectSettingsComponent,
    AutoShareComponent,
    PayMarketDefaultSettingsComponent,
    PayMarketCutComponent,
    ProjectTemplatesComponent,
    UserProfileComponent
  ]
})
export class UserSettingsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
