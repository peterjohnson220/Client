import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbTooltipModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng5SliderModule } from 'ng5-slider';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { JobResultComponent, DataCutsComponent, FilterSectionComponent, JobDetailsTooltipComponent,
         MultiSelectFilterComponent, MatchesDetailsTooltipComponent, FilterHeaderComponent, RangeFilterComponent
} from './components';

import { AddSurveyDataPageComponent, MultiMatchPageComponent, SearchResultsComponent, SearchFiltersComponent,
         TooltipContainerComponent, SingleFilterComponent } from './containers';

import {
  AddSurveyDataPageEffects,
  MultiMatchPageEffects,
  SearchFiltersEffects,
  SearchResultsEffects,
  SingledFilterEffects,
  TooltipContainerEffects
} from './effects';
import { reducers } from './reducers';
import { AddDataEffectsService } from './services';
import { AddDataRoutingModule } from './add-data-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule,

    // 3rd Party
    StoreModule.forFeature('project_addData', reducers),
    EffectsModule.forFeature([AddSurveyDataPageEffects, SearchFiltersEffects, SearchResultsEffects,
      TooltipContainerEffects, SingledFilterEffects, MultiMatchPageEffects
    ]),
    InfiniteScrollModule,
    NgbTooltipModule,
    NgbPopoverModule.forRoot(),
    Ng5SliderModule,

    // Routing
    AddDataRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    JobResultComponent, DataCutsComponent, FilterSectionComponent, JobDetailsTooltipComponent,
    MultiSelectFilterComponent, MatchesDetailsTooltipComponent, FilterHeaderComponent, RangeFilterComponent,

    // Containers
    SearchResultsComponent, SearchFiltersComponent, TooltipContainerComponent, SingleFilterComponent,

    // Pages
    AddSurveyDataPageComponent, MultiMatchPageComponent
  ],
  entryComponents: [
    JobDetailsTooltipComponent
  ],
  providers: [
    AddDataEffectsService
  ]
})
export class AddDataModule { }
