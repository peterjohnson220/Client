import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { DashboardPreferencesComponent } from './components';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';

import { UserSettingsPageEffects } from './effects';
import { UserSettingsPageComponent } from './user-settings.page';
import { UserSettingsRoutingModule } from './user-settings-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    UserSettingsRoutingModule,

    // 3rd party
    StoreModule.forFeature('userSettings_main', reducers),
    EffectsModule.forFeature([
      UserSettingsPageEffects
    ]),
    FontAwesomeModule,
    NgbPopoverModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,


  ],
  declarations: [
    // Pages
    UserSettingsPageComponent,

    // Components
    DashboardPreferencesComponent
  ]
})
export class UserSettingsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
