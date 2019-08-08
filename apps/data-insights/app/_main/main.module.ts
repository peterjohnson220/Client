import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DragulaModule } from 'ng2-dragula';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfCommonModule, WindowRef } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { StandardReportComponent, TagWorkbookModalComponent, WorkbookCardComponent, SearchWorkbookResultComponent,
  WorkbookViewsComponent, StandardReportHexagonComponent, SaveUserWorkbookModalComponent, LeftSidebarComponent,
  LeftSidebarExistingFieldsComponent } from './components';
import { DataInsightsPageComponent, DashboardsComponent, ReportViewPageComponent,
  CustomReportViewPageComponent, SearchWorkbookModalComponent, DataViewGridComponent } from './containers';
import { DataInsightsPageEffects, DashboardsEffects, ReportViewPageEffects, DataViewEffects, DataViewGridEffects } from './effects';
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
      DataViewGridEffects
    ]),
    FontAwesomeModule,
    DropDownsModule,
    DragulaModule.forRoot(),
    NgbPopoverModule.forRoot(),
    NgbTooltipModule,
    GridModule,

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
    SearchWorkbookModalComponent, DataViewGridComponent,

    // Components
    StandardReportComponent, WorkbookCardComponent, SearchWorkbookResultComponent, WorkbookViewsComponent,
    StandardReportHexagonComponent, SaveUserWorkbookModalComponent, LeftSidebarComponent, LeftSidebarExistingFieldsComponent,
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
