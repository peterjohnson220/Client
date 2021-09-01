import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { PrintRoutingModule } from './print-routing.module';
import * as fromFaIcons from './fa-icons';
import { JobSummaryPrintComponent, JobSummaryReportPrintTemplateComponent } from './containers';
import { reducers } from './reducers';
import { JobSummaryPrintEffect } from './effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    FontAwesomeModule,

    StoreModule.forFeature('comphub_print', reducers),
    EffectsModule.forFeature([
      JobSummaryPrintEffect
    ]),

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,

    // Routing
    PrintRoutingModule
  ],
  declarations: [
    JobSummaryPrintComponent,
    JobSummaryReportPrintTemplateComponent
  ]
})
export class PrintModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
