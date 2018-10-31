import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';


import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';


import { AddJobsPageComponent } from './containers';
import { reducers } from './reducers';

import { AddJobsRoutingModule } from './add-jobs-routing.module';
import { AddJobsPageEffects } from './effects/add-jobs-page.effects';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule,

    // 3rd Party
    StoreModule.forFeature('project_addJobs', reducers),
    EffectsModule.forFeature([
      AddJobsPageEffects
    ]),
    // Routing
    AddJobsRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components

    // Pages
    AddJobsPageComponent
  ],
  providers: []
})
export class AddJobsModule { }
