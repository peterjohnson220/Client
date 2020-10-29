import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DragulaModule } from 'ng2-dragula';
import { NgbPopoverModule, NgbTooltipModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { PfCommonModule, WindowRef } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfReportsModule } from 'libs/features/reports/reports.module';

import { DataInsightsSharedModule } from '../_shared/shared.module';

import {
  TagWorkbookModalComponent, SearchWorkbookResultComponent,
  WorkbookViewsComponent, ViewCardComponent, WorkbookViewsCardComponent, FavoriteViewsComponent,
  DataViewReportsComponent, DataViewReportCardComponent, StandardReportComponent
} from './components';

import { DataInsightsPageComponent, DashboardsComponent, ReportViewPageComponent,
  SearchWorkbookModalComponent, DashboardsHeaderComponent, ViewsComponent, WorkbookCardComponent,
  TableauWorkbookCardComponent, DataViewWorkbookCardComponent, CreateDataViewModalComponent
} from './containers';

import { DataInsightsPageEffects, DashboardsEffects, ViewsEffects, DataViewEffects } from './effects';
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
      ViewsEffects,
      DataViewEffects
    ]),
    FontAwesomeModule,
    DropDownsModule,
    DragulaModule.forRoot(),
    NgbPopoverModule,
    NgbTooltipModule,
    NgbCollapseModule,
    DateInputsModule,

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfReportsModule,

    // Data Insights
    DataInsightsSharedModule
  ],
  declarations: [
    // Containers
    DataInsightsPageComponent, DashboardsComponent, ReportViewPageComponent, TagWorkbookModalComponent,
    SearchWorkbookModalComponent, DashboardsHeaderComponent, ViewsComponent, WorkbookCardComponent,
    TableauWorkbookCardComponent, DataViewWorkbookCardComponent, CreateDataViewModalComponent,

    // Components
    SearchWorkbookResultComponent, WorkbookViewsComponent,
    ViewCardComponent, WorkbookViewsCardComponent, FavoriteViewsComponent, DataViewReportsComponent,
    DataViewReportCardComponent, StandardReportComponent
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
