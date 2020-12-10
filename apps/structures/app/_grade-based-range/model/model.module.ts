import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfFormsModule } from 'libs/forms';
import { PfCommonModule, WindowCommunicationService, WindowRef } from 'libs/core';
import { PfAddJobsModule } from 'libs/features/add-jobs';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfSearchModule } from 'libs/features/search';

import { ModelRoutingModule } from './model-routing.module';
import { ModelPageComponent } from './model.page/model.page';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // PF
    PfFormsModule,
    PfCommonModule,
    PfAddJobsModule,
    PfCommonUIModule,
    PfSearchModule,

    // Routing
    ModelRoutingModule
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
