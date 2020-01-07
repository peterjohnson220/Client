import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DragulaModule } from 'ng2-dragula';
import { NgbPopoverModule, NgbTooltipModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { GridModule } from '@progress/kendo-angular-grid';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';

import { PfCommonModule, WindowRef } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { StandardReportComponent, TagWorkbookModalComponent, SearchWorkbookResultComponent,
  WorkbookViewsComponent, SaveUserWorkbookModalComponent,
  ReportFieldComponent, DeleteUserWorkbookModalComponent, AddReportFieldsComponent,
  ViewCardComponent, WorkbookViewsCardComponent, FavoriteViewsComponent, FilterCardComponent,
  DateRangeFilterComponent, MultiSelectFilterComponent, NumericFilterComponent, TextFilterComponent,
  BitFilterComponent, ConfigureSidebarComponent, ViewAllFieldsComponent, FieldGroupComponent, ShareReportModalComponent,
  DataViewReportsComponent, DataViewReportCardComponent
} from './components';
import { DataInsightsPageComponent, DashboardsComponent, ReportViewPageComponent,
  CustomReportViewPageComponent, SearchWorkbookModalComponent, DataViewGridComponent,
  DashboardsHeaderComponent, ViewsComponent, FiltersComponent, FieldsComponent,
  WorkbookCardComponent, TableauWorkbookCardComponent, DataViewWorkbookCardComponent
} from './containers';
import { DataInsightsPageEffects, DashboardsEffects, ReportViewPageEffects, DataViewEffects, DataViewGridEffects,
  ViewsEffects, FiltersEffects, FieldsEffects
} from './effects';
import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';
import { MainRoutingModule } from './main-routing.module';
import { DataViewModule } from '../_data-view';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('dataInsights_main', reducers),
    EffectsModule.forFeature([
      DataInsightsPageEffects,
      DashboardsEffects,
      ReportViewPageEffects,
      DataViewEffects,
      DataViewGridEffects,
      ViewsEffects,
      FiltersEffects,
      FieldsEffects
    ]),
    FontAwesomeModule,
    DropDownsModule,
    DragulaModule.forRoot(),
    NgbPopoverModule.forRoot(),
    NgbTooltipModule,
    GridModule,
    PerfectScrollbarModule,
    NgbCollapseModule,
    DateInputsModule,
    NumericTextBoxModule,

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,

    // Data Insights
    DataViewModule
  ],
  declarations: [
    // Containers
    DataInsightsPageComponent, DashboardsComponent, ReportViewPageComponent, CustomReportViewPageComponent, TagWorkbookModalComponent,
    SearchWorkbookModalComponent, DataViewGridComponent, DashboardsHeaderComponent, ViewsComponent, FiltersComponent,
    FieldsComponent, WorkbookCardComponent, TableauWorkbookCardComponent, DataViewWorkbookCardComponent,

    // Components
    StandardReportComponent, SearchWorkbookResultComponent, WorkbookViewsComponent,
    SaveUserWorkbookModalComponent, ReportFieldComponent, DeleteUserWorkbookModalComponent, AddReportFieldsComponent,
    ViewCardComponent, WorkbookViewsCardComponent, FavoriteViewsComponent, FilterCardComponent, DateRangeFilterComponent,
    MultiSelectFilterComponent, NumericFilterComponent, TextFilterComponent, BitFilterComponent, ConfigureSidebarComponent,
    ViewAllFieldsComponent, FieldGroupComponent, ShareReportModalComponent, DataViewReportsComponent, DataViewReportCardComponent
  ],
  providers: [
    WindowRef
  ]
})
export class MainModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
