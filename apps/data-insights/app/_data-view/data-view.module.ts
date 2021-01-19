import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { NgbPopoverModule, NgbTooltipModule, NgbCollapseModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { GridModule } from '@progress/kendo-angular-grid';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { DragulaModule } from 'ng2-dragula';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { FormulaEditorModule } from 'libs/features/formula-editor';

import {
  AddReportFieldsComponent, ConfigureSidebarComponent, DeleteUserWorkbookModalComponent,
  FieldGroupComponent, FilterCardComponent, BitFilterComponent, DateRangeFilterComponent, MultiSelectFilterComponent,
  NumericFilterComponent, TextFilterComponent, ReportFieldComponent, ShareReportModalComponent,
  ViewAllFieldsComponent, FormulaCardComponent, DeleteUserFormulaModalComponent, ViewInfoComponent, ExportPopoverComponent
} from './components';
import {
  FormulaFieldModalComponent, DataViewGridComponent, DataViewPageComponent, FieldsComponent, FiltersComponent,
  NumericFieldFormattingModalComponent, FormulasComponent, EditDataViewModalComponent, DuplicateDataViewModalComponent,
  DateFieldFormattingModalComponent
} from './containers';
import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';
import {
  FormulaFieldEffects, DataViewEffects, DataViewGridEffects, FiltersEffects, FieldsEffects
} from './effects';
import { DataViewRoutingModule } from './data-view-routing.module';
import { DataInsightsSharedModule } from '../_shared/shared.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('dataView_main', reducers),
    EffectsModule.forFeature([
      FormulaFieldEffects,
      DataViewEffects,
      DataViewGridEffects,
      FiltersEffects,
      FieldsEffects
    ]),
    FontAwesomeModule,
    DropDownsModule,
    CodemirrorModule,
    GridModule,
    DragulaModule.forRoot(),
    NgbPopoverModule,
    NumericTextBoxModule,
    DateInputsModule,
    NgbTooltipModule,
    NgbCollapseModule,
    NgbAlertModule,
    PerfectScrollbarModule,
    SwitchModule,

    // Routing
    DataViewRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,

    // Data Insights
    DataInsightsSharedModule,
    FormulaEditorModule
  ],

  declarations: [
    // Containers
    FormulaFieldModalComponent, DataViewGridComponent, DataViewPageComponent, FieldsComponent, FiltersComponent,
    NumericFieldFormattingModalComponent, FormulasComponent, EditDataViewModalComponent, DuplicateDataViewModalComponent, DateFieldFormattingModalComponent,

    // Components
    AddReportFieldsComponent, ConfigureSidebarComponent, DeleteUserWorkbookModalComponent,
    FieldGroupComponent, FilterCardComponent, BitFilterComponent, DateRangeFilterComponent, MultiSelectFilterComponent,
    NumericFilterComponent, TextFilterComponent, ReportFieldComponent, ShareReportModalComponent,
    ViewAllFieldsComponent, FormulaCardComponent, DeleteUserFormulaModalComponent, ViewInfoComponent, ExportPopoverComponent
  ]
})
export class DataViewModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
