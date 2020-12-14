import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { PfFormsModule } from 'libs/forms';
import { PfCommonModule, WindowCommunicationService, WindowRef } from 'libs/core';
import { PfAddJobsModule } from 'libs/features/add-jobs';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfSearchModule } from 'libs/features/search';
import { PfDataGridModule } from 'libs/features/pf-data-grid';

import { ModelRoutingModule } from './model-routing.module';
import { ModelPageComponent } from './model.page/model.page';
import { SharedModule } from '../../_job-based-range/shared/shared.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    NgbCollapseModule,

    // PayFactors
    PfFormsModule,
    PfDataGridModule,
    PfCommonModule,
    PfAddJobsModule,
    PfCommonUIModule,
    PfSearchModule,

    // Routing
    ModelRoutingModule,

    SharedModule
  ],
  declarations: [ModelPageComponent],
  providers: [
    WindowRef,
    WindowCommunicationService
  ]
})
export class ModelModule {
  constructor() {}
}
