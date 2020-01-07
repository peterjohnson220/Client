import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import * as fromFaIcons from './fa-icons';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { PasswordSettingEffects } from './effects/password-setting.effects';
import { reducers } from './reducers';

import { PasswordManagementPageComponent } from './password-management.page/password-management.page';
import { PasswordManagementSettingsComponent, SavePasswordSettingsModalComponent } from './containers';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('companyAdminPasswordSettings', reducers),
    EffectsModule.forFeature([
      PasswordSettingEffects,
    ]),
    GridModule,
    LayoutModule,
    FontAwesomeModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
  ],
  declarations: [
   // Feature
   PasswordManagementPageComponent,

   // Containers
   PasswordManagementSettingsComponent,
   SavePasswordSettingsModalComponent,
  ],
  exports: [
    PasswordManagementPageComponent
  ]
})
export class PasswordManagementModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
   }
}
