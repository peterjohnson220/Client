import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { HighchartsChartModule } from 'highcharts-angular';

import { PfAddJobsModule } from 'libs/features/jobs/add-jobs';
import { PfCommonModule, WindowCommunicationService, WindowRef } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { UserFilterPopoverConfig } from 'libs/features/users/user-filter/models';
import { AddJobsConfig } from 'libs/features/jobs/add-jobs/data';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfSearchModule } from 'libs/features/search/search';

import { AddJobsModalWrapperComponent, JobBasedRangeChartComponent, PublishModelModalComponent } from './containers';
import { AddJobsUserFilterPopoverConfig, JobBasedRangeAddJobsConfig } from './data';
import { AddJobsModalEffects, CompareJobRangesEffects, SearchPageEffects, SearchResultsEffects, SingledFilterEffects } from './effects';
import { ModelPageComponent } from './model.page';
import { ModelRoutingModule } from './model-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CompareJobBasedRangeChartComponent } from './containers/compare-job-based-range-chart/compare-job-based-range-chart.component';
import { reducers } from './reducers';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('model_jobRange', reducers),
    EffectsModule.forFeature([
      AddJobsModalEffects,
      SearchPageEffects,
      SearchResultsEffects,
      SingledFilterEffects,
      CompareJobRangesEffects
    ]),
    PerfectScrollbarModule,
    DropDownsModule,
    FontAwesomeModule,
    HighchartsChartModule,
    NumericTextBoxModule,

    // Payfactors
    PfFormsModule,
    PfCommonModule,
    PfAddJobsModule,
    PfCommonUIModule,
    PfSearchModule,

    // Routing
    ModelRoutingModule,

    // Shared
    SharedModule
  ],
  declarations: [
    ModelPageComponent,
    AddJobsModalWrapperComponent,
    PublishModelModalComponent,
    JobBasedRangeChartComponent,
    CompareJobBasedRangeChartComponent
  ],
  providers: [
    WindowRef,
    WindowCommunicationService,
    { provide: UserFilterPopoverConfig, useValue: AddJobsUserFilterPopoverConfig },
    { provide: AddJobsConfig, useValue: JobBasedRangeAddJobsConfig }
  ]
})
export class ModelModule {
  constructor() { }
}
