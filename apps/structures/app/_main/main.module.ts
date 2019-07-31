import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ChartModule } from '@progress/kendo-angular-charts';
import {
  NgbModalModule,
  NgbPaginationModule,
  NgbProgressbarModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { PfCommonModule } from 'libs/core';
import { WindowRef } from 'libs/core/services';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import * as fromFaIcons from './fa-icons';
import { JobBasedRangeAllStructuresEffects, JobRangeModelingPageEffects } from './effects';
import { reducers } from './reducers';
import { MainRoutingModule } from './main-routing.module';
import { ModelNameInputComponent, ModelingSettingsComponent, StructureCardComponent } from './components';
import {
  JobBasedRangeStructuresPageComponent, JobRangeModelingPageComponent, JobBasedRangeAllStructuresComponent, JobRangeModelingGridComponent
} from './containers';
import { JobRangeModelingGridEffects } from './effects/job-range-modeling-grid.effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('structures_main', reducers),
    EffectsModule.forFeature([
      JobRangeModelingPageEffects,
      JobBasedRangeAllStructuresEffects,
      JobRangeModelingGridEffects
    ]),
    PerfectScrollbarModule,
    FontAwesomeModule,

    // Routing
    MainRoutingModule,

    // 3rd Party
    DropDownsModule,
    GridModule,
    ChartModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbProgressbarModule,
    NgbTooltipModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    ModelNameInputComponent,
    ModelingSettingsComponent,
    StructureCardComponent,

    // Containers
    JobRangeModelingPageComponent,
    JobBasedRangeStructuresPageComponent,
    JobBasedRangeAllStructuresComponent,
    JobRangeModelingGridComponent
  ],
  providers: [
    WindowRef
  ]
})
export class MainModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
