import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfSearchModule } from 'libs/features/search/search';

import {
  RelationalExchangeJobSearchFiltersEffects,
  RelationalExchangeJobSearchResultsEffects,
  RelationalExchangeJobSearchSingleFilterEffects,
  RelationalExchangeJobSearchUserFilterEffects, SearchRelationalExchangeJobEffects
} from './effects';
import { RelationalExchangeJobSearchComponent } from './containers';
import { RelationalExchangeJobSearchResultsComponent } from './containers/relational-exchange-job-search-results';
import { RelationalExchangeJobResultComponent } from './components';
import { reducers } from './reducers';
import * as fromFaIcons from './fa-icons';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // PF
    PfCommonUIModule,
    InfiniteScrollModule,
    PfSearchModule,

    // 3rd Party
    FontAwesomeModule,
    StoreModule.forFeature('libs_peer_relationalExchangeJobSearch', reducers),
    EffectsModule.forFeature([
      RelationalExchangeJobSearchFiltersEffects,
      RelationalExchangeJobSearchResultsEffects,
      RelationalExchangeJobSearchSingleFilterEffects,
      RelationalExchangeJobSearchUserFilterEffects,
      SearchRelationalExchangeJobEffects
    ])
  ],
  declarations: [
    // Containers
    RelationalExchangeJobSearchComponent,
    RelationalExchangeJobSearchResultsComponent,

    // Components
    RelationalExchangeJobResultComponent
  ],
  exports: [RelationalExchangeJobSearchComponent]
})
export class PfPeerRelationalExchangeJobSearchModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
