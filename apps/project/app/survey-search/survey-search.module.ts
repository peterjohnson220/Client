import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from 'ng2-dragula';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { SearchFilterMappingDataObj } from 'libs/features/search/models';
import { PfSearchModule } from 'libs/features/search';

import { JobResultComponent, DataCutsComponent, MatchesDetailsTooltipComponent } from './components';
import { TooltipContainerComponent, SurveySearchResultsComponent } from './containers';
import { SurveySearchFilterMappingDataObj } from './data';
import { SurveySearchFiltersEffects, SearchResultsEffects, SingledFilterEffects,
TooltipContainerEffects, SavedFiltersEffects, ContextEffects } from './effects';
import { reducers } from './reducers';
import { SurveySearchEffectsService } from './services';
import { PayfactorsSurveySearchApiHelper } from './helpers';

const components = [
    // Components
    JobResultComponent, DataCutsComponent, MatchesDetailsTooltipComponent,

    // Containers
    SurveySearchResultsComponent, TooltipContainerComponent,
];
@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('project_surveySearch', reducers),
    EffectsModule.forFeature([SurveySearchFiltersEffects, SearchResultsEffects,
      TooltipContainerEffects, SingledFilterEffects, SavedFiltersEffects, ContextEffects
    ]),
    NgbTooltipModule,
    DragulaModule.forRoot(),

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    PfSearchModule
  ],
  declarations: components,
  exports: components,
  providers: [
    SurveySearchEffectsService,
    PayfactorsSurveySearchApiHelper,
    { provide: SearchFilterMappingDataObj, useValue: SurveySearchFilterMappingDataObj }
  ]
})
export class SurveySearchModule { }
