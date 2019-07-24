import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DragulaModule } from 'ng2-dragula';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { PfCommonModule, WindowRef } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { StandardReportComponent, TagWorkbookModalComponent, WorkbookCardComponent, SearchWorkbookResultComponent,
  WorkbookViewsComponent, StandardReportHexagonComponent } from './components';
import { DataInsightsPageComponent, DashboardsComponent, ReportViewPageComponent, SearchWorkbookModalComponent } from './containers';
import { DataInsightsPageEffects, DashboardsEffects, ReportViewPageEffects } from './effects';
import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,

    // 3rd Party
    StoreModule.forFeature('dataInsights_main', reducers),
    EffectsModule.forFeature([
      DataInsightsPageEffects,
      DashboardsEffects,
      ReportViewPageEffects
    ]),
    FontAwesomeModule,
    DropDownsModule,
    DragulaModule.forRoot(),
    NgbPopoverModule.forRoot(),

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Containers
    DataInsightsPageComponent, DashboardsComponent, ReportViewPageComponent, TagWorkbookModalComponent,
    SearchWorkbookModalComponent,

    // Components
    StandardReportComponent, WorkbookCardComponent, SearchWorkbookResultComponent, WorkbookViewsComponent,
    StandardReportHexagonComponent
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
