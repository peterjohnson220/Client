import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

import { reducers } from './reducers';
import { PfDataGridEffects } from './effects';

import { PfFormsModule } from 'libs/forms';
import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfColumnChooserModule } from 'libs/ui/column-chooser/column-chooser.module';

import { PfDataGridComponent } from './pf-data-grid.component/pf-data-grid.component';
import { ActionBarComponent, GridComponent } from './containers';
import { PfGridColumnComponent } from './components';
import {
  FilterPanelComponent,
  FilterChooserComponent,
  FilterBuilderComponent,
  PfDataGridFilterPillsComponent
} from './components/grid-filter';

import {PfDataGridSaveViewModalComponent} from './components/grid-filter/modals';
import {NgbModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

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
    PfColumnChooserModule,

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
    PfDataGridSaveViewModalComponent
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
