import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AddSurveyDataPageComponent } from './containers';
import { AddSurveyDataPageEffects } from './effects';
import { JobResultComponent } from './components';
import { reducers } from './reducers';
import { AddDataRoutingModule } from './add-data-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('project_addData', reducers),
    EffectsModule.forFeature([AddSurveyDataPageEffects]),

    // Routing
    AddDataRoutingModule
  ],
  declarations: [
    // Pages
    AddSurveyDataPageComponent,
    JobResultComponent
  ]
})
export class AddDataModule { }







