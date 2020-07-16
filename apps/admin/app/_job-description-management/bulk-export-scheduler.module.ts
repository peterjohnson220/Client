import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {PfCommonUIModule} from 'libs/ui/common/index';
import { PfJobDescriptionManagementModule } from 'libs/features/job-description-management';

import {BulkExportSchedulerFormComponent} from './containers/bulk-export-schedule-form';
import {BulkExportSchedulerPageComponent} from './containers/pages';
import { JdmBulkExportSchedulerRoutingModule } from './bulk-export-scheduler-routing.module';
import { reducers } from './reducers';
import { JdmBulkExportScheduleEffects, JdmFiltersEffects, JdmViewEffects } from './effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,

    // 3rd Party
    StoreModule.forFeature('jdmAdmin', reducers),
    EffectsModule.forFeature([JdmViewEffects, JdmFiltersEffects, JdmBulkExportScheduleEffects]),

    // Routing
    JdmBulkExportSchedulerRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfJobDescriptionManagementModule,
    FontAwesomeModule
  ],
  declarations: [
    // Components
    BulkExportSchedulerFormComponent,

    // Pages
    BulkExportSchedulerPageComponent
  ]
})
export class JdmBulkExportSchedulerModule { }
