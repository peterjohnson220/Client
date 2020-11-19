import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {PfCommonUIModule} from 'libs/ui/common/index';
import { PfBulkExportSchedulerModule } from 'libs/features/bulk-job-description-export-scheduler';

import {BulkExportSchedulerPageComponent} from './containers/pages';
import { JdmBulkExportSchedulerRoutingModule } from './bulk-export-scheduler-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,

    // Routing
    JdmBulkExportSchedulerRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfBulkExportSchedulerModule,
    FontAwesomeModule
  ],
  declarations: [
    // Pages
    BulkExportSchedulerPageComponent
  ]
})
export class JdmBulkExportSchedulerModule { }
