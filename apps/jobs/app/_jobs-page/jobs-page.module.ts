import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LayoutModule } from '@progress/kendo-angular-layout';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as fromFaIcons from './fa-icons';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { JobsPageEffects } from './effects';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/pf-data-grid/pf-data-grid.module';
import { PfColumnChooserModule } from 'libs/ui/column-chooser/column-chooser.module';

import { JobsPageComponent } from './jobs.page/jobs.page';
import { JobsPageRoutingModule } from './jobs-page-routing.module';

import { JobsDetailsComponent, EmployeesGridComponent, PricingDetailsGridComponent } from './components';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    LayoutModule,
    StoreModule.forFeature('jobsPageMain', reducers),
    EffectsModule.forFeature([
      JobsPageEffects,
    ]),
    FontAwesomeModule,
    NgbTabsetModule,

    // Routing
    JobsPageRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfDataGridModule,
    PfColumnChooserModule
  ],
  declarations: [
    // Pages
    JobsPageComponent,

    // Components
    JobsDetailsComponent,
    EmployeesGridComponent,
    PricingDetailsGridComponent
  ]
})
export class JobsPageModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
