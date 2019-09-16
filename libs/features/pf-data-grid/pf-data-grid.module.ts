import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as fromFaIcons from './fa-icons';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { PfDataGridEffects } from './effects';

import { PfFormsModule } from 'libs/forms';
import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';

import { PfDataGridComponent } from './pf-data-grid.component/pf-data-grid.component';
import { ActionBarComponent, GridComponent } from './containers';


@NgModule({
  imports: [
    CommonModule,

    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,

    // 3rd Party
    StoreModule.forFeature('pfDataGrids', reducers),
    EffectsModule.forFeature([
      PfDataGridEffects,
    ]),
    GridModule,
    LayoutModule,
    DropDownListModule,
    FontAwesomeModule,
  ],
  declarations: [
    PfDataGridComponent,
    ActionBarComponent,
    GridComponent
  ],
  exports: [
    PfDataGridComponent
  ],
})
export class PfDataGridModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
