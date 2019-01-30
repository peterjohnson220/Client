import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { ComphubPageComponent, JobsPageComponent, MarketsPageComponent, DataPageComponent, PageLayoutComponent,
  SummaryPageComponent } from './containers';
import { JobsPageEffects, PaymarketPageEffects, DataPageEffects } from './effects';
import { reducers } from './reducers';
import { MainRoutingModule } from './main-routing.module';
import { TrendingJobGroupComponent, CardLayoutComponent, SelectPaymarketsComponent } from './components';
import { WindowRef } from './services';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,

    // 3rd Party
    StoreModule.forFeature('comphub_main', reducers),
    EffectsModule.forFeature([
      JobsPageEffects,
      PaymarketPageEffects,
      DataPageEffects
    ]),

    // Routing
    MainRoutingModule,

    // 3rd Party
    DropDownsModule,
    GridModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    TrendingJobGroupComponent,
    CardLayoutComponent,

    // Pages
    ComphubPageComponent,
    JobsPageComponent,
    MarketsPageComponent,
    PageLayoutComponent,
    DataPageComponent,
    SummaryPageComponent,
    SelectPaymarketsComponent
  ],
  providers: [
    WindowRef
  ]
})
export class MainModule { }
