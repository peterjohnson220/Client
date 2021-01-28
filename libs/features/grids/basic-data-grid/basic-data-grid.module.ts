import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfCommonUIModule } from 'libs/ui/common';

import { BasicDataGridComponent } from './containers';
import { reducers } from './reducers';
import { BasicDataGridEffects } from './effects';
import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('feature_basic_data_grid', reducers),
    EffectsModule.forFeature([ BasicDataGridEffects ]),
    FontAwesomeModule,
    GridModule,

    // Payfactors
    PfCommonUIModule
  ],
  declarations: [
    // Components
    BasicDataGridComponent
  ],
  exports: [ BasicDataGridComponent ]
})
export class BasicDataGridModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
