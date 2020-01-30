import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';

import { ViewEditorComponent } from './components';
import { JobInfoViewEditorComponent } from './containers';
import { ViewEditEffects, JobInfoViewEditorEffects } from './effects';
import { reducers } from './reducers';
import { ViewEditPageComponent } from './view-edit.page';
import * as fromFaIcons from '../view-edit/fa-icons';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule,

    // 3rd Party
    StoreModule.forFeature('jobDescriptionManagement_settings_viewEdit', reducers),
    EffectsModule.forFeature([ViewEditEffects, JobInfoViewEditorEffects]),

    // Payfactors
    PfFormsModule,
    FontAwesomeModule,
    PfCommonUIModule,
    PfCommonModule
  ],
  declarations: [
    // Components
    ViewEditorComponent,

    // Containers
    JobInfoViewEditorComponent,

    // Feature
    ViewEditPageComponent
  ],
  exports: [
    ViewEditPageComponent,
  ]
})
export class ViewEditModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
