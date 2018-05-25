import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import {PfCommonUIModule} from 'libs/ui/common/index';

import {BulkExportSchedulerFormComponent} from './containers/bulk-export-schedule-form/bulk-export-scheduler-form.component';
import {BulkExportSchedulerPageComponent} from './containers/pages/index';
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
    PfCommonUIModule
  ],
  declarations: [
    // Components
    BulkExportSchedulerFormComponent,

    // Pages
    BulkExportSchedulerPageComponent
  ]
})
export class JdmBulkExportSchedulerModule { }
