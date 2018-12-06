import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { DragulaModule } from 'ng2-dragula';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { JobToPriceComponent } from './components';
import {  MultiMatchPageComponent, JobsToPriceContainerComponent } from './containers';
import { MultiMatchPageEffects, JobsToPriceEffects } from './effects';
import { reducers } from './reducers';
import { MultiMatchRoutingModule } from './multi-match-routing.module';
import { SharedSurveySearchModule } from '../shared/shared.module';


@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('project_multiMatch', reducers),
    EffectsModule.forFeature([MultiMatchPageEffects, JobsToPriceEffects
    ]),
    DragulaModule.forRoot(),

    // Routing
    MultiMatchRoutingModule,

    // Payfactors
    SharedSurveySearchModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    JobToPriceComponent,

    // Containers
    JobsToPriceContainerComponent,

    // Pages
    MultiMatchPageComponent
  ]
})
export class MultiMatchModule { }
