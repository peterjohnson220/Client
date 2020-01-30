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
  WorkbookViewsComponent, ViewCardComponent, WorkbookViewsCardComponent, FavoriteViewsComponent,
  DataViewReportsComponent, DataViewReportCardComponent
} from './components';

import { DataInsightsPageComponent, DashboardsComponent, ReportViewPageComponent,
  SearchWorkbookModalComponent, DashboardsHeaderComponent, ViewsComponent, WorkbookCardComponent,
  TableauWorkbookCardComponent, DataViewWorkbookCardComponent, CreateDataViewModalComponent
} from './containers';

import { DataInsightsPageEffects, DashboardsEffects, ReportViewPageEffects, ViewsEffects, DataViewEffects } from './effects';
import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';
import { MainRoutingModule } from './main-routing.module';
import { DataInsightsSharedModule } from '../_shared/shared.module';
import { AbstractBaseDataViewModal } from '../_shared/containers';

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
      ViewsEffects,
      DataViewEffects
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
    DataInsightsSharedModule
  ],
  declarations: [
    // Containers
    DataInsightsPageComponent, DashboardsComponent, ReportViewPageComponent, TagWorkbookModalComponent,
    SearchWorkbookModalComponent, DashboardsHeaderComponent, ViewsComponent, WorkbookCardComponent,
    TableauWorkbookCardComponent, DataViewWorkbookCardComponent, CreateDataViewModalComponent,

    // Components
    StandardReportComponent, SearchWorkbookResultComponent, WorkbookViewsComponent,
    ViewCardComponent, WorkbookViewsCardComponent, FavoriteViewsComponent, DataViewReportsComponent,
    DataViewReportCardComponent
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
