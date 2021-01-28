import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import { PfCommonModule } from 'libs/core';

import { FormulaEditorComponent } from './components';
import * as fromFaIcons from './fa-icons';

@NgModule({
  declarations: [
    FormulaEditorComponent
  ],
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    FontAwesomeModule,
    CodemirrorModule,

    // Payfactors
    PfCommonModule
  ],
  exports: [
    FormulaEditorComponent
  ],
})
export class FormulaEditorModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
 }
