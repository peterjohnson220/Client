import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
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

import { StandardReportComponent, TagWorkbookModalComponent, WorkbookCardComponent, SearchWorkbookResultComponent,
  WorkbookViewsComponent, SaveUserWorkbookModalComponent,
  ReportFieldComponent, DeleteUserWorkbookModalComponent, AddReportFieldsComponent,
  ViewCardComponent, WorkbookViewsCardComponent, FavoriteViewsComponent, FilterCardComponent,
  DateRangeFilterComponent, MultiSelectFilterComponent, NumericFilterComponent, TextFilterComponent,
  BitFilterComponent } from './components';
import { DataInsightsPageComponent, DashboardsComponent, ReportViewPageComponent,
  CustomReportViewPageComponent, SearchWorkbookModalComponent, DataViewGridComponent, LeftSidebarComponent,
  DashboardsHeaderComponent, ViewsComponent, FiltersComponent } from './containers';
import { DataInsightsPageEffects, DashboardsEffects, ReportViewPageEffects, DataViewEffects, DataViewGridEffects,
  ViewsEffects, DataViewConfigurationEffects
} from './effects';
import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';
import { MainRoutingModule } from './main-routing.module';

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
      DataViewConfigurationEffects
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
    PfFormsModule
  ],
  declarations: [
    // Containers
    DataInsightsPageComponent, DashboardsComponent, ReportViewPageComponent, CustomReportViewPageComponent, TagWorkbookModalComponent,
    SearchWorkbookModalComponent, DataViewGridComponent, LeftSidebarComponent, DashboardsHeaderComponent, ViewsComponent, FiltersComponent,

    // Components
    StandardReportComponent, WorkbookCardComponent, SearchWorkbookResultComponent, WorkbookViewsComponent,
    SaveUserWorkbookModalComponent, ReportFieldComponent, DeleteUserWorkbookModalComponent, AddReportFieldsComponent,
    ViewCardComponent, WorkbookViewsCardComponent, FavoriteViewsComponent, FilterCardComponent, DateRangeFilterComponent,
    MultiSelectFilterComponent, NumericFilterComponent, TextFilterComponent, BitFilterComponent

  ],
  providers: [
    WindowRef
  ]
})
export class MainModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
