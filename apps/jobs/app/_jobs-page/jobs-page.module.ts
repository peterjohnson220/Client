import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { LayoutModule } from '@progress/kendo-angular-layout';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features';

import { JobsPageComponent } from './containers';
import { JobsPageEffects } from './effects';
import { reducers } from './reducers';
import { JobsPageRoutingModule } from './jobs-page-routing.module';
import * as fromFaIcons from './fa-icons';

import { ComplexColumnComponent } from './grid-components/complex-column/complex-column.component';
import { JobsDetailsComponent } from './grid-components/jobs-details/jobs-details.component';



@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Third Party
    StoreModule.forFeature('jobsPageMain', reducers),
    EffectsModule.forFeature([JobsPageEffects]),
    DropDownListModule,
    FontAwesomeModule,
    LayoutModule,

    // Routing
    JobsPageRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfDataGridModule
  ],
  declarations: [
    // Pages
    JobsPageComponent,

    // Components
    ComplexColumnComponent,
    JobsDetailsComponent
  ]
})
export class JobsPageModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
