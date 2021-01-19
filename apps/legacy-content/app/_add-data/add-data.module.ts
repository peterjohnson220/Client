import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfSearchModule, SurveySearchModule } from 'libs/features';

import { AddSurveyDataPageComponent } from './containers';
import { AddSurveyDataPageEffects } from './effects';
import { reducers } from './reducers';
import { AddDataRoutingModule } from './add-data-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('project_addData', reducers),
    EffectsModule.forFeature([AddSurveyDataPageEffects]),

    // Routing
    AddDataRoutingModule,

    // Payfactors
    SurveySearchModule,
    PfCommonUIModule,
    PfFormsModule,
    PfSearchModule
  ],
  declarations: [
    // Pages
    AddSurveyDataPageComponent
  ]
})
export class AddDataModule { }
