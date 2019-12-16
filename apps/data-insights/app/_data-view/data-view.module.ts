import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';

import { FormulaEditorComponent } from './components';
import { FormulaFieldModalComponent } from './containers';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';
import { FormulaFieldModalEffects } from './effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('dataView_main', reducers),
    EffectsModule.forFeature([
      FormulaFieldModalEffects
    ]),
    FontAwesomeModule,
    DropDownsModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule
  ],

  declarations: [ FormulaEditorComponent, FormulaFieldModalComponent ],
  exports: [ FormulaFieldModalComponent, FormulaEditorComponent ]
})
export class DataViewModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
