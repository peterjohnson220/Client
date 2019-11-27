import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as fromFaIcons from './fa-icons';

import { PfFormsModule } from 'libs/forms';
import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';

import { reducers } from './reducers';
import { PfDataGridEffects } from './effects';
import { PfDataGridComponent } from './pf-data-grid.component/pf-data-grid.component';
import { ActionBarComponent, GridComponent } from './containers';
import {
  PfGridColumnComponent,
  FilterPanelComponent,
  FilterChooserComponent,
  FilterBuilderComponent,
  PfDataGridFilterPillsComponent,
  PfDataGridSaveViewModalComponent,
  ColumnChooserComponent
} from './components';

@NgModule({
  imports: [
    CommonModule,
    NgbTooltipModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
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
    DatePickerModule,
    NumericTextBoxModule,
    FontAwesomeModule,
  ],
  declarations: [
    PfDataGridComponent,
    ActionBarComponent,
    GridComponent,
    PfGridColumnComponent,
    FilterPanelComponent,
    FilterChooserComponent,
    FilterBuilderComponent,
    PfDataGridFilterPillsComponent,
    PfDataGridSaveViewModalComponent,
    ColumnChooserComponent,
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
