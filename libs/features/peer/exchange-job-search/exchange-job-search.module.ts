import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfSearchModule } from 'libs/features/search/search';

import {
  ExchangeJobSearchFiltersEffects,
  ExchangeJobSearchResultsEffects,
  ExchangeJobSearchSingleFilterEffects,
  ExchangeJobSearchUserFilterEffects, SearchExchangeJobEffects
} from './effects';
import { ExchangeJobSearchComponent } from './containers';
import { ExchangeJobSearchResultsComponent } from './containers/exchange-job-search-results';
import { ExchangeJobResultComponent } from './components';
import { reducers } from './reducers';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // PF
    PfCommonUIModule,
    InfiniteScrollModule,
    PfSearchModule,

    // 3rd Party
    StoreModule.forFeature('libs_peer_exchangeJobSearch', reducers),
    EffectsModule.forFeature([
      ExchangeJobSearchFiltersEffects,
      ExchangeJobSearchResultsEffects,
      ExchangeJobSearchSingleFilterEffects,
      ExchangeJobSearchUserFilterEffects,
      SearchExchangeJobEffects
    ])
  ],
  declarations: [
    // Containers
    ExchangeJobSearchComponent,
    ExchangeJobSearchResultsComponent,

    // Components
    ExchangeJobResultComponent
  ],
  exports: [ExchangeJobSearchComponent]
})
export class PfPeerExchangeJobSearchModule {}
