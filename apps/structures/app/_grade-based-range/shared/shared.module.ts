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

import { PfFormsModule } from 'libs/forms';
import { RangeEditorModule } from 'libs/features/structures/range-editor';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';
import { FormulaEditorModule } from 'libs/ui/formula-editor';
import { PfCommonModule } from 'libs/core';


import * as fromFaIcons from '../../_job-based-range/shared/fa-icons';
import { ModelGridComponent } from './containers/model-grid/model-grid.component';
import { GradeBasedSummaryChartComponent } from './containers/grade-based-summary-chart';
import { SharedModule } from '../../shared/shared.module';
import { JobBasedSharedModule } from '../../_job-based-range/shared/shared.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    RouterModule,

    // 3rd party
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
    RangeEditorModule,
    PfCommonModule,
    PfCommonUIModule,
    FormulaEditorModule,
    FormsModule,

    SharedModule,
    JobBasedSharedModule,

  ],
  declarations: [
    ModelGridComponent,
    GradeBasedSummaryChartComponent
  ],
  exports: [
    ModelGridComponent,
    GradeBasedSummaryChartComponent
  ],
  providers: []
})
export class GradeBasedSharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
