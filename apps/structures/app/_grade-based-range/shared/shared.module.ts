import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbCollapseModule, NgbDropdownModule, NgbPopoverModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AutoCompleteModule, ComboBoxModule, DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { NumericTextBoxModule, SwitchModule } from '@progress/kendo-angular-inputs';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';
import { FormulaEditorModule } from 'libs/ui/formula-editor';
import { PfCommonModule } from 'libs/core';

import * as fromFaIcons from './fa-icons';
import { ModelGridComponent } from './containers/model-grid/model-grid.component';
import { GradeBasedSummaryChartComponent } from './containers/grade-based-summary-chart';
import { SharedModule } from '../../shared/shared.module';
import { GradeBasedVerticalRangeChartComponent } from './containers/grade-based-vertical-range-chart';
import { reducers } from './reducers';

import {
  SharedEffects
} from './effects';
import { ModelSettingsModalContentComponent } from './containers/model-settings-modal-content/model-settings-modal-content.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    RouterModule,

    // 3rd party
    StoreModule.forFeature('structures_gradeBasedRange_shared', reducers),
    EffectsModule.forFeature([
      SharedEffects
    ]),
    NgbCollapseModule,
    FontAwesomeModule,
    NgbTabsetModule,
    AutoCompleteModule,
    ComboBoxModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbDropdownModule,
    CodemirrorModule,
    SwitchModule,
    HighchartsChartModule,

    // Payfactors
    PfDataGridModule,
    PfFormsModule,
    NumericTextBoxModule,
    DropDownListModule,
    ReactiveFormsModule,
    PfCommonModule,
    PfCommonUIModule,
    FormulaEditorModule,
    FormsModule,

    SharedModule
  ],
  declarations: [
    ModelGridComponent,
    GradeBasedSummaryChartComponent,
    GradeBasedVerticalRangeChartComponent,
    ModelSettingsModalContentComponent
  ],
  exports: [
    ModelGridComponent,
    GradeBasedSummaryChartComponent,
    GradeBasedVerticalRangeChartComponent
  ],
  providers: [
  ]
})
export class GradeBasedSharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
