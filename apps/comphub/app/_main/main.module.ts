import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { ComphubPageComponent, JobsCardComponent, MarketsCardComponent, DataCardComponent, CardLayoutComponent,
  SummaryCardComponent } from './containers';
import { JobsCardEffects, MarketsCardEffects, AddPayMarketFormEffects, DataCardEffects, ComphubPageEffects,
  SummaryCardEffects } from './effects';
import { reducers } from './reducers';
import { TrendingJobGroupComponent, CardComponent, PaymarketCardsComponent, AddPayMarketFormComponent } from './components';
import { WindowRef } from './services';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('comphub_main', reducers),
    EffectsModule.forFeature([
      JobsCardEffects,
      DataCardEffects,
      MarketsCardEffects,
      AddPayMarketFormEffects,
      ComphubPageEffects,
      SummaryCardEffects
    ]),
    PerfectScrollbarModule,

    // Routing
    MainRoutingModule,

    // 3rd Party
    DropDownsModule,
    GridModule,
    NgbPaginationModule,
    NgbModalModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    TrendingJobGroupComponent,
    CardComponent,
    AddPayMarketFormComponent,

    // Pages
    ComphubPageComponent,
    JobsCardComponent,
    MarketsCardComponent,
    CardLayoutComponent,
    DataCardComponent,
    SummaryCardComponent,
    PaymarketCardsComponent
  ],
  providers: [
    WindowRef
  ]
})
export class MainModule { }
