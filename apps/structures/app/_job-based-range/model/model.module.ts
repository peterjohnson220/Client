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
import { PfAddJobsToRangeModule } from 'libs/features/structures/add-jobs-to-range';

import { JobBasedRangeChartComponent, PublishModelModalComponent } from './containers';
import { JobBasedRangeAddJobsConfig } from './data';
import { CompareJobRangesEffects } from './effects';
import { ModelPageComponent } from './model.page';
import { ModelRoutingModule } from './model-routing.module';
import { JobBasedSharedModule } from '../shared/shared.module';
import { CompareJobBasedRangeChartComponent } from './containers/compare-job-based-range-chart/compare-job-based-range-chart.component';
import { reducers } from './reducers';
import { SharedModule } from '../../shared/shared.module';
import { AddJobsUserFilterPopoverConfig } from '../../shared/data';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('model_jobRange', reducers),
    EffectsModule.forFeature([
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
    PfAddJobsToRangeModule,

    // Routing
    ModelRoutingModule,

    // Shared
    JobBasedSharedModule,
    SharedModule
  ],
  declarations: [
    ModelPageComponent,
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
