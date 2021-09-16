import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AutoCompleteModule, ComboBoxModule, DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { NumericTextBoxModule, SwitchModule } from '@progress/kendo-angular-inputs';
import { HighchartsChartModule } from 'highcharts-angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';
import { FormulaEditorModule } from 'libs/ui/formula-editor';
import { PfCommonModule } from 'libs/core';

import * as fromFaIcons from './fa-icons';
import { SharedModule } from '../../shared/shared.module';
import {
  GradeBasedHorizontalRangeChartComponent,
  GradeBasedVerticalRangeChartComponent,
  ModelGridComponent,
  GradeBasedSummaryChartComponent,
  SwitchRegressionFlagsModalComponent,
  AddGradeModalComponent
} from './containers';
import { reducers } from './reducers';
import {
  PublishModelModalEffects,
  SharedEffects,
  SwitchRegressionFlagsModalEffects,
  AddGradeModalEffects
} from './effects';


@NgModule({
  imports: [
    // Angular
    CommonModule,
    RouterModule,

    // 3rd party
    StoreModule.forFeature('structures_gradeBasedRange_shared', reducers),
    EffectsModule.forFeature([
      SharedEffects,
      SwitchRegressionFlagsModalEffects,
      PublishModelModalEffects,
      AddGradeModalEffects
    ]),
    NgbCollapseModule,
    FontAwesomeModule,
    AutoCompleteModule,
    ComboBoxModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbDropdownModule,
    NgbNavModule,
    CodemirrorModule,
    SwitchModule,
    HighchartsChartModule,
    GridModule,

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
    GradeBasedHorizontalRangeChartComponent,
    GradeBasedVerticalRangeChartComponent,
    SwitchRegressionFlagsModalComponent,
    AddGradeModalComponent
  ],
  exports: [
    ModelGridComponent,
    GradeBasedSummaryChartComponent,
    GradeBasedHorizontalRangeChartComponent,
    GradeBasedVerticalRangeChartComponent,
    AddGradeModalComponent
  ],
  providers: [
  ]
})
export class GradeBasedSharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
