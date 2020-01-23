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
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfCommonModule, WindowCommunicationService } from 'libs/core';
import { WindowRef } from 'libs/core/services';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfAddJobsModule } from 'libs/features/add-jobs';
import { PfSearchModule } from 'libs/features/search';
import { UserFilterPopoverConfig } from 'libs/features/user-filter/models';

import * as fromFaIcons from './fa-icons';
import {
  JobBasedRangeAllStructuresEffects,
  JobRangeModelingPageEffects,
  JobRangeModelingGridEffects,
  JobBasedRangesAddJobsModalPageEffects,
  JobBasedRangesSearchResultsEffects,
  JobRangeModelingModalEffects
} from './effects';
import { reducers } from './reducers';
import { MainRoutingModule } from './main-routing.module';
import {
  JobBasedRangeAllStructuresComponent,
  JobBasedRangeStructureFavoriteComponent,
  ModelNameInputComponent,
  StructureCardComponent,
  EditGridColumnsModalComponent,
  StructureFavoriteHexagonComponent
} from './components';
import {
  JobBasedRangeStructuresPageComponent,
  JobRangeModelingPageComponent,
  JobRangeModelingGridComponent,
  JobBasedRangesAddJobsModalPageComponent,
  JobBasedRangesSearchResultsComponent,
  ModelingSettingsModalPageComponent,
  JobRangeModelingModalComponent
} from './containers';
import { JobBasedRangesAddJobsUserFilterPopoverConfig } from './data';

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
      JobBasedRangesAddJobsModalPageEffects,
      JobBasedRangesSearchResultsEffects,
      JobBasedRangeAllStructuresEffects,
      JobRangeModelingGridEffects,
      JobRangeModelingModalEffects
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
    PfFormsModule,
    PfAddJobsModule,
    PfSearchModule
  ],
  declarations: [
    // Components
    JobBasedRangeAllStructuresComponent,
    JobBasedRangeStructureFavoriteComponent,
    ModelNameInputComponent,
    ModelingSettingsModalPageComponent,
    StructureCardComponent,
    EditGridColumnsModalComponent,
    StructureFavoriteHexagonComponent,

    // Containers
    JobRangeModelingPageComponent,
    JobBasedRangeStructuresPageComponent,
    JobRangeModelingGridComponent,
    JobBasedRangesAddJobsModalPageComponent,
    JobBasedRangesSearchResultsComponent,
    ModelingSettingsModalPageComponent,
    JobRangeModelingModalComponent
  ],
  providers: [
    WindowRef,
    WindowCommunicationService,
    {provide: UserFilterPopoverConfig, useValue: JobBasedRangesAddJobsUserFilterPopoverConfig}
  ]
})
export class MainModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
