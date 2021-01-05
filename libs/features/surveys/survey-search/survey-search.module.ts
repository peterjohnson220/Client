import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from 'ng2-dragula';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { SearchFilterMappingDataObj } from 'libs/features/search/search/models';
import { PfSearchModule } from 'libs/features/search/search';
import { UserFilterTypeData } from 'libs/features/users/user-filter/models';
import { PfCommonModule } from 'libs/core';

import * as fromFaIcons from './fa-icons';
import { DataCutsComponent, MatchesDetailsTooltipComponent } from './components';
import { TooltipContainerComponent, JobResultComponent } from './containers';
import { SurveySearchFilterMappingDataObj, SurveySearchUserFilterType } from './data';
import { SurveySearchFiltersEffects, SearchResultsEffects, SingledFilterEffects,
TooltipContainerEffects, SavedFiltersEffects, ContextEffects } from './effects';
import { reducers } from './reducers';
import { SurveySearchEffectsService } from './services';
import { PayfactorsSurveySearchApiHelper, SavedFilterHelper } from './helpers';
import { SurveySearchResultsComponent } from './survey-search-results';

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
        StoreModule.forFeature('feature_surveySearch', reducers),
        EffectsModule.forFeature([SurveySearchFiltersEffects, SearchResultsEffects,
            TooltipContainerEffects, SingledFilterEffects, SavedFiltersEffects, ContextEffects
        ]),
        NgbTooltipModule,
        DragulaModule.forRoot(),
        FontAwesomeModule,

        // Payfactors
        PfCommonUIModule,
        PfFormsModule,
        PfSearchModule, PfCommonModule
    ],
  declarations: components,
  exports: [SurveySearchResultsComponent],
  providers: [
    SurveySearchEffectsService,
    PayfactorsSurveySearchApiHelper,
    SavedFilterHelper
  ]
})
export class SurveySearchModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
