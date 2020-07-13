import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { Ng5SliderModule } from 'ng5-slider';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfUserFilterModule } from 'libs/features/user-filter';

import * as fromFaIcons from './fa-icons';
import { FilterPillsComponent, FilterSectionComponent, MultiSelectFilterComponent, RangeFilterComponent, FilterableMultiSelectFilterComponent,
SearchLayoutComponent } from './components';
import { SearchFiltersComponent, SingleFilterComponent, ChildFilterComponent, ResultsHeaderComponent,
SearchResultsComponent } from './containers';
import { reducers } from './reducers';
import { PayfactorsSearchApiHelper, PayfactorsSearchApiModelMapper } from './helpers';
import { SearchFiltersEffects, SearchPageEffects } from './effects';
import { SearchEffectsService } from './services';
import { PfInfiniteScrollModule } from '../infinite-scroll';
import { PfEntityDescriptionModule } from '../entity-description/entity-description.module';

const declarations = [
  // Components
  FilterPillsComponent, FilterSectionComponent, MultiSelectFilterComponent,
  RangeFilterComponent, FilterableMultiSelectFilterComponent,

  // Containers
  SearchFiltersComponent, SingleFilterComponent, ChildFilterComponent, ResultsHeaderComponent, SearchResultsComponent, SearchLayoutComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Payfactors
    PfFormsModule,
    PfCommonUIModule,
    PfUserFilterModule,
    PfInfiniteScrollModule,
    PfEntityDescriptionModule,

    // 3rd Party
    StoreModule.forFeature('feature_search', reducers),
    EffectsModule.forFeature([SearchFiltersEffects, SearchPageEffects]),
    PerfectScrollbarModule,
    Ng5SliderModule,
    InfiniteScrollModule,
    NgbPopoverModule,
    FontAwesomeModule,
    NgbTooltipModule
  ],
  providers: [
    PayfactorsSearchApiHelper,
    PayfactorsSearchApiModelMapper,
    SearchEffectsService
  ],
  declarations: [
    declarations,
  ],
  exports: declarations
})
export class PfSearchModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
