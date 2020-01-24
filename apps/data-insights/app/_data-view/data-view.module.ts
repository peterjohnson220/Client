import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';


import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';

import { FormulaEditorComponent, FormulaCardComponent, DeleteUserFormulaModalComponent } from './components';
import { FormulaFieldModalComponent, FormulasComponent } from './containers';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';
import { FormulaFieldEffects } from './effects';


@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('dataView_main', reducers),
    EffectsModule.forFeature([
      FormulaFieldEffects
    ]),
    FontAwesomeModule,
    DropDownsModule,
    CodemirrorModule,
    NgbPopoverModule,
    PerfectScrollbarModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule
  ],

  declarations: [
    // Components
    FormulaEditorComponent, FormulaCardComponent, DeleteUserFormulaModalComponent,

    // Containers
    FormulaFieldModalComponent, FormulasComponent
  ],
  exports: [
    // Components
    FormulaEditorComponent, FormulaCardComponent,

    // Containers
    FormulaFieldModalComponent, FormulasComponent
  ]
})
export class DataViewModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
