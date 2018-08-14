import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { JobResultComponent, DataCutsComponent, FilterSectionComponent, JobDetailsTooltipComponent,
         MultiSelectFilterComponent } from './components';
import { AddSurveyDataPageComponent, SearchResultsComponent, SearchFiltersComponent } from './containers';
import {AddSurveyDataPageEffects, SearchFiltersEffects, SearchResultsEffects} from './effects';
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
    EffectsModule.forFeature([AddSurveyDataPageEffects, SearchFiltersEffects, SearchResultsEffects]),
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

    // Containers
    SearchResultsComponent, SearchFiltersComponent,

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







