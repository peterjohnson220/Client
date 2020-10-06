import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import * as fromFaIcons from './fa-icons';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { reducers } from './reducers';
import { NotesManagerEffects } from './effects';

import { NotesManagerComponent } from './notes-manager/notes-manager.component';
import { NotesManagerContentComponent } from './containers';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('feature_notes_manager', reducers),
    EffectsModule.forFeature([
      NotesManagerEffects,
    ]),
    FontAwesomeModule,
    LayoutModule,
    GridModule,
    DropDownListModule,

    // Payfactors
    PfCommonUIModule,
    PfCommonModule,
    PfFormsModule,
  ],
  declarations: [
    // Feature
    NotesManagerComponent,
    NotesManagerContentComponent
  ],
  exports: [
    NotesManagerComponent,
  ]
})

export class NotesManagerModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}

