import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { JobResultComponent, DataCutsComponent, FilterSectionComponent } from './components';
import { AddSurveyDataPageComponent, SearchResultsComponent, SearchFiltersComponent } from './containers';
import { AddSurveyDataPageEffects } from './effects';
import { reducers } from './reducers';
import { AddDataRoutingModule } from './add-data-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule,

    // 3rd Party
    StoreModule.forFeature('project_addData', reducers),
    EffectsModule.forFeature([AddSurveyDataPageEffects]),
    InfiniteScrollModule,

    // Routing
    AddDataRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    JobResultComponent, DataCutsComponent, FilterSectionComponent,

    // Containers
    SearchResultsComponent, SearchFiltersComponent,

    // Pages
    AddSurveyDataPageComponent
  ]
})
export class AddDataModule { }







