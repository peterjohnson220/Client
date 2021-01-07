import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import * as fromFaIcons from './fa-icons';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { SecuritySettingEffects } from './effects/security-setting.effects';
import { reducers } from './reducers';

import { SecuritySettingsPageComponent } from './security-settings.page/security-settings.page';
import { SecurityManagementSettingsComponent, SaveSecuritySettingsModalComponent } from './containers';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('companyAdminPasswordSettings', reducers),
    EffectsModule.forFeature([
      SecuritySettingEffects,
    ]),
    GridModule,
    LayoutModule,
    FontAwesomeModule,
    NgbTooltipModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
  ],
  declarations: [
   // Feature
   SecuritySettingsPageComponent,

   // Containers
   SecurityManagementSettingsComponent,
   SaveSecuritySettingsModalComponent,
  ],
  exports: [
    SecuritySettingsPageComponent
  ]
})
export class SecuritySettingsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
   }
}
