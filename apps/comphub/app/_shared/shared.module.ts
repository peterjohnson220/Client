import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { ChartModule } from '@progress/kendo-angular-charts';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModalModule, NgbPaginationModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { GuidelinesBadgeModule } from 'libs/features/peer/guidelines-badge';
import { BasicDataGridModule } from 'libs/features/grids/basic-data-grid';

import { JobGridComponent } from './containers';
import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';
import {
  AddPayMarketFormEffects,
  ComphubPageEffects,
  DataCardEffects,
  JobGridEffects,
  JobsCardEffects,
  MarketsCardEffects,
  SummaryCardEffects
} from './effects';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    DropDownsModule,
    GridModule,
    ChartModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    FontAwesomeModule,

    StoreModule.forFeature('comphub_shared', reducers),
    EffectsModule.forFeature([
      ComphubPageEffects,
      DataCardEffects,
      JobsCardEffects,
      MarketsCardEffects,
      SummaryCardEffects,
      AddPayMarketFormEffects,
      JobGridEffects
    ]),

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    GuidelinesBadgeModule,
    BasicDataGridModule

  ],
  declarations: [
    JobGridComponent
  ],
  exports: [
    JobGridComponent
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
