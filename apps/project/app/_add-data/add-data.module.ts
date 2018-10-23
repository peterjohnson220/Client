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

import { JobResultComponent, DataCutsComponent, FilterSectionComponent, MultiSelectFilterComponent,
  MatchesDetailsTooltipComponent, FilterPillsComponent, RangeFilterComponent, SearchActionsComponent,
  JobToPriceComponent
} from './components';
import { AddSurveyDataPageComponent, MultiMatchPageComponent, SearchResultsComponent, SearchFiltersComponent,
         TooltipContainerComponent, SingleFilterComponent, JobsToPriceComponent } from './containers';
import { AddSurveyDataPageEffects, MultiMatchPageEffects, SearchFiltersEffects, SearchResultsEffects, SingledFilterEffects,
         TooltipContainerEffects, JobsToPriceEffects } from './effects';
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
      TooltipContainerEffects, SingledFilterEffects, MultiMatchPageEffects, JobsToPriceEffects
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
    JobResultComponent, DataCutsComponent, FilterSectionComponent, MultiSelectFilterComponent,
    MatchesDetailsTooltipComponent, FilterPillsComponent, RangeFilterComponent, SearchActionsComponent,
    JobToPriceComponent,

    // Containers
    SearchResultsComponent, SearchFiltersComponent, TooltipContainerComponent, SingleFilterComponent,
    JobsToPriceComponent,

    // Pages
    AddSurveyDataPageComponent, MultiMatchPageComponent
  ],
  providers: [
    AddDataEffectsService
  ]
})
export class AddDataModule { }
