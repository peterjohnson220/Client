import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { JobManagementEffects } from './effects/job-management.effects';
import { reducers } from './reducers';

import { JobManagementComponent } from './job-management/job-management.component';
import { JobFormComponent } from './containers';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('feature_job_management', reducers),
    EffectsModule.forFeature([
      JobManagementEffects,
    ]),
    GridModule,
    LayoutModule,
    DropDownsModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
  ],
  declarations: [
    // Feature
    JobManagementComponent,

    // Components
    JobFormComponent
  ],
  exports: [
    JobManagementComponent,
  ]
})

export class JobManagementModule { }
