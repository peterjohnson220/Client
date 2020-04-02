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

import { PfAddJobsModule } from 'libs/features/add-jobs';
import { PfCommonModule, WindowCommunicationService, WindowRef } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { UserFilterPopoverConfig } from 'libs/features/user-filter/models';
import { AddJobsConfig } from 'libs/features/add-jobs/data';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfSearchModule } from 'libs/features/search';

import { AddJobsModalComponent, JobBasedRangeChartComponent, PublishModelModalComponent } from './containers';
import { AddJobsUserFilterPopoverConfig, JobBasedRangeAddJobsConfig } from './data';
import { AddJobsModalEffects, SearchPageEffects, SearchResultsEffects } from './effects';
import { ModelPageComponent } from './model.page';
import { ModelRoutingModule } from './model-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    EffectsModule.forFeature([
      AddJobsModalEffects,
      SearchPageEffects,
      SearchResultsEffects
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
    AddJobsModalComponent,
    PublishModelModalComponent,
    JobBasedRangeChartComponent
  ],
  providers: [
    WindowRef,
    WindowCommunicationService,
    { provide: UserFilterPopoverConfig, useValue: AddJobsUserFilterPopoverConfig },
    { provide: AddJobsConfig, useValue: JobBasedRangeAddJobsConfig },
  ]
})
export class ModelModule {
  constructor() { }
}
