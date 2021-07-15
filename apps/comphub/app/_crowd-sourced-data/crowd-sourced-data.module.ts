import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { ChartModule } from '@progress/kendo-angular-charts';
import { NgbModalModule, NgbPaginationModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { GuidelinesBadgeModule } from 'libs/features/peer/guidelines-badge';
import { BasicDataGridModule } from 'libs/features/grids/basic-data-grid';

import { CrowdSourcedDataPageComponent } from './containers/pages/crowd-sourced-data';
import { CrowdSourcedDataRoutingModule } from './crowd-sourced-data-routing.module';
import * as fromFaIcons from './fa-icons';
import { CrowdSourcedJobsCardComponent } from './containers/cards/crowd-sourced-jobs/crowd-sourced-jobs.card.component';
import { MainModule } from '../_main/main.module';
import { CrowdSourcedDataPageGuard } from './guards';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CrowdSourcedDataRoutingModule,
    MainModule,

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
    GuidelinesBadgeModule,
    BasicDataGridModule

  ],
  declarations: [
    CrowdSourcedDataPageComponent,
    CrowdSourcedJobsCardComponent
  ],
  providers: [
    CrowdSourcedDataPageGuard
  ]
})
export class CrowdSourcedDataModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
