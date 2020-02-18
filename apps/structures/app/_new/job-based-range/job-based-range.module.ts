import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { GridModule } from '@progress/kendo-angular-grid';
import { ChartModule } from '@progress/kendo-angular-charts';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgbModalModule, NgbPaginationModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { PfAddJobsModule } from 'libs/features/add-jobs';
import { PfDataGridModule } from 'libs/features/pf-data-grid';
import { PfCommonModule, WindowCommunicationService, WindowRef } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { UserFilterPopoverConfig } from 'libs/features/user-filter/models';
import { AddJobsConfig } from 'libs/features/add-jobs/data';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfSearchModule } from 'libs/features/search';

import { AddJobsModalComponent, ModelingSettingsModalPageComponent } from './containers';
import { AddJobsUserFilterPopoverConfig, JobBasedRangeAddJobsConfig } from './data';
import { AddJobsModalEffects, JobBasedRangeModalEffects, ModelingSettingsPageEffects, SearchResultsEffects } from './effects';
import { reducers } from './reducers';
import { JobBasedRangePageComponent } from './job-based-range.page';



@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('structures_jobBasedRange', reducers),
    EffectsModule.forFeature([
      AddJobsModalEffects,
      ModelingSettingsPageEffects,
      JobBasedRangeModalEffects,
      SearchResultsEffects
    ]),
    PerfectScrollbarModule,
    DropDownsModule,
    FontAwesomeModule,
    NumericTextBoxModule,

    // Payfactors
    PfFormsModule,
    PfDataGridModule,
    PfCommonModule,
    PfAddJobsModule,
    PfCommonUIModule,
    PfSearchModule
  ],
  declarations: [
    JobBasedRangePageComponent,
    AddJobsModalComponent,
    ModelingSettingsModalPageComponent
  ],
  providers: [
    WindowRef,
    WindowCommunicationService,
    { provide: UserFilterPopoverConfig, useValue: AddJobsUserFilterPopoverConfig },
    { provide: AddJobsConfig, useValue: JobBasedRangeAddJobsConfig },
  ],
  exports: [
    JobBasedRangePageComponent,
    // todo: remove export once _main removed
    ModelingSettingsModalPageComponent
  ]
})
export class JobBasedRangeModule {
  constructor() { }
}
