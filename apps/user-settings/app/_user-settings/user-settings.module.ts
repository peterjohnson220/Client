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
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfUserSettingsModule } from 'libs/features/user-settings';
import { ProjectTemplateManagementModule } from 'libs/features/project-template-management';

import {
  MyProfileComponent,
  DashboardPreferencesComponent,
  PersonalProjectSettingsComponent,
  AutoShareComponent,
  PayMarketDefaultSettingsComponent,
  PayMarketCutComponent,
  ProjectTemplatesComponent,
  UserProfileComponent,
  ChangePasswordComponent,
} from './containers';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';

import {
  DashboardPreferencesEffects,
  UserProfileEffects,
  ProjectTemplateEffects,
  PayMarketDefaultSettingsEffects,
  ChangePasswordEffects,
  EmailPreferencesEffects,
  NotificationPreferencesEffects
} from './effects';
import { UserSettingsPageComponent } from './user-settings.page';
import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { EmailPreferencesComponent } from './containers/communication-preferences/email-preferences/email-preferences.component';
import { NotificationPreferencesComponent } from './containers/communication-preferences/notification-preferences/notification-preferences.component';
import { MarketingPreferencesComponent } from './containers/communication-preferences/marketing-preferences/marketing-preferences.component';
import { CommunicationPreferencesComponent } from './containers/communication-preferences/communication-preferences.component';

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
      PayMarketDefaultSettingsEffects,
      ChangePasswordEffects,
      EmailPreferencesEffects,
      NotificationPreferencesEffects
    ]),
    FontAwesomeModule,
    NgbPopoverModule,
    NgbModule,
    ImgFallbackModule,
    UploadsModule,
    DropDownsModule,
    GridModule,
    NumericTextBoxModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfUserSettingsModule,
    ProjectTemplateManagementModule
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
    ChangePasswordComponent,
    UserProfileComponent,
    CommunicationPreferencesComponent,
    EmailPreferencesComponent,
    NotificationPreferencesComponent,
    MarketingPreferencesComponent
  ]
})
export class UserSettingsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
