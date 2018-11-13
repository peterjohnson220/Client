import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbTooltipModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng5SliderModule } from 'ng5-slider';
import { DragulaModule } from 'ng2-dragula';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { JobResultComponent, DataCutsComponent, FilterSectionComponent, MultiSelectFilterComponent,
  MatchesDetailsTooltipComponent, FilterPillsComponent, RangeFilterComponent,
  SurveySearchLayoutComponent, SaveFilterModalComponent } from './components';
import { SearchResultsComponent, SearchFiltersComponent,
  TooltipContainerComponent, SingleFilterComponent, ResultsHeaderComponent, SavedFiltersComponent } from './containers';
import { SearchFiltersEffects, SearchResultsEffects, SingledFilterEffects,
  TooltipContainerEffects, SavedFiltersEffects, SearchEffectsEffects } from './effects';
import { reducers } from './reducers';
import { SurveySearchEffectsService } from './services';

const components = [
    // Components
    JobResultComponent, DataCutsComponent, FilterSectionComponent, MultiSelectFilterComponent,
    MatchesDetailsTooltipComponent, FilterPillsComponent, RangeFilterComponent,
    SurveySearchLayoutComponent, SaveFilterModalComponent,

    // Containers
    SearchResultsComponent, SearchFiltersComponent, TooltipContainerComponent, SingleFilterComponent,
    ResultsHeaderComponent, SavedFiltersComponent,
];
@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('project_shared', reducers),
    EffectsModule.forFeature([SearchFiltersEffects, SearchResultsEffects,
      TooltipContainerEffects, SingledFilterEffects, SavedFiltersEffects, SearchEffectsEffects
    ]),
    InfiniteScrollModule,
    NgbTooltipModule,
    NgbPopoverModule.forRoot(),
    Ng5SliderModule,
    DragulaModule.forRoot(),
    PerfectScrollbarModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: components,
  exports: components,
  providers: [
    SurveySearchEffectsService
  ]
})
export class SharedSurveySearchModule { }
