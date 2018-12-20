import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfSearchModule } from 'libs/features/search';

import { SearchFilterMappingDataObj } from 'libs/features/search/models';
import { AddJobsRoutingModule } from './add-jobs-routing.module';
import { reducers } from './reducers';
import { AddJobsPageEffects, SearchResultsEffects, SearchFiltersEffects, SingledFilterEffects, PaymarketEffects,
         CreateNewJobPageEffects } from './effects';
import { AddJobsPageComponent, SearchResultsComponent, PaymarketsComponent, CreateNewJobPageComponent } from './containers';
import { JobResultComponent } from './components';
import { SearchFilterMappingData } from './data';
import { CustomRouteReuseStrategy } from '../route-reuse-strategy';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('project_addJobs', reducers),
    EffectsModule.forFeature([
      AddJobsPageEffects,
      CreateNewJobPageEffects,
      SearchResultsEffects,
      SearchFiltersEffects,
      SingledFilterEffects,
      PaymarketEffects
    ]),
    InfiniteScrollModule,
    DropDownsModule,

    // Routing
    AddJobsRoutingModule,

    // Payfactors
    PfSearchModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    SearchResultsComponent,
    JobResultComponent,

    // Containers
    PaymarketsComponent,

    // Pages
    AddJobsPageComponent, CreateNewJobPageComponent
  ],
  providers: [
    { provide: SearchFilterMappingDataObj, useValue: SearchFilterMappingData }
  ]
})
export class AddJobsModule { }
