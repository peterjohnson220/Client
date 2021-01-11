import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { PfFormsModule } from 'libs/forms';

import { BulkExportSchedulerFormComponent, BulkExportSchedulesListComponent } from './containers';
import { BulkJobsExportScheduleEffects, BulkJobsExportScheduleFiltersEffects, BulkJobsExportScheduleViewEffects } from './effects';
import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';


@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    NgbModule,

    // 3rd Party
    StoreModule.forFeature('feature_bulk_jobs_export_scheduler', reducers),
    EffectsModule.forFeature([
      BulkJobsExportScheduleViewEffects,
      BulkJobsExportScheduleFiltersEffects,
      BulkJobsExportScheduleEffects
    ]),

    // Payfactors
    FontAwesomeModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    BulkExportSchedulerFormComponent,
    BulkExportSchedulesListComponent
  ],
  exports: [
    BulkExportSchedulerFormComponent,
    BulkExportSchedulesListComponent
  ]
})
export class PfBulkExportSchedulerModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
