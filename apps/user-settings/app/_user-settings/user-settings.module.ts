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

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import {
  MyProfileComponent,
  DashboardPreferencesComponent,
  PersonalProjectSettingsComponent,
  AutoShareComponent,
  PayMarketDefaultSettingsComponent,
  ProjectTemplatesComponent,
  UserProfileComponent
} from './containers';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';

import { DashboardPreferencesEffects, UserProfileEffects, ProjectTemplateEffects } from './effects';
import { UserSettingsPageComponent } from './user-settings.page';
import { UserSettingsRoutingModule } from './user-settings-routing.module';

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
      ProjectTemplateEffects
    ]),
    FontAwesomeModule,
    NgbPopoverModule,
    NgbModule,
    ImgFallbackModule,
    UploadsModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
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
    ProjectTemplatesComponent,
    UserProfileComponent
  ]
})
export class UserSettingsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
