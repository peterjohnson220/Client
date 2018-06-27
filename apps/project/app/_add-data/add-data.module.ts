import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { PfCommonUIModule } from 'libs/ui/common';

import { JobResultComponent, DataCutsComponent } from './components';
import { AddSurveyDataPageComponent, SearchResultsComponent } from './containers';
import { AddSurveyDataPageEffects } from './effects';
import { reducers } from './reducers';
import { AddDataRoutingModule } from './add-data-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('project_addData', reducers),
    EffectsModule.forFeature([AddSurveyDataPageEffects]),
    InfiniteScrollModule,

    // Routing
    AddDataRoutingModule,

    // Payfactors
    PfCommonUIModule
  ],
  declarations: [
    // Containers
    SearchResultsComponent,

    // Pages
    AddSurveyDataPageComponent,
    JobResultComponent,
    DataCutsComponent
  ]
})
export class AddDataModule { }







