import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { ComphubPageComponent, JobsPageComponent, MarketsPageComponent, PageLayoutComponent,
  DataPageComponent, SummaryPageComponent } from './containers';
import { JobsPageEffects } from './effects';
import { reducers } from './reducers';
import { MainRoutingModule } from './main-routing.module';
import { TrendingJobGroupComponent, CardLayoutComponent } from './components';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('comphub_main', reducers),
    EffectsModule.forFeature([
      JobsPageEffects
    ]),

    // Routing
    MainRoutingModule,

    // 3rd Party
    DropDownsModule,

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
    SummaryPageComponent
  ]
})
export class MainModule { }
