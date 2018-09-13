import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { JobResultComponent, DataCutsComponent, FilterSectionComponent, JobDetailsTooltipComponent,
         MultiSelectFilterComponent, MatchesDetailsTooltipComponent, FilterHeaderComponent } from './components';
import { AddSurveyDataPageComponent, SearchResultsComponent, SearchFiltersComponent,
         TooltipContainerComponent, SingleFilterComponent } from './containers';
import {
  AddSurveyDataPageEffects,
  SearchFiltersEffects,
  SearchResultsEffects,
  SingledFilterEffects,
  TooltipContainerEffects
} from './effects';
import { reducers } from './reducers';
import { AddDataEffectsService } from './services';
import { AddDataRoutingModule } from './add-data-routing.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule,

    // 3rd Party
    StoreModule.forFeature('project_addData', reducers),
    EffectsModule.forFeature([AddSurveyDataPageEffects, SearchFiltersEffects, SearchResultsEffects,
      TooltipContainerEffects, SingledFilterEffects
    ]),
    InfiniteScrollModule,
    NgbTooltipModule,

    // Routing
    AddDataRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    JobResultComponent, DataCutsComponent, FilterSectionComponent, JobDetailsTooltipComponent, MultiSelectFilterComponent,
    MatchesDetailsTooltipComponent, FilterHeaderComponent,

    // Containers
    SearchResultsComponent, SearchFiltersComponent, TooltipContainerComponent, SingleFilterComponent,

    // Pages
    AddSurveyDataPageComponent
  ],
  entryComponents: [
    JobDetailsTooltipComponent
  ],
  providers: [
    AddDataEffectsService
  ]
})
export class AddDataModule { }







