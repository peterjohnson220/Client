import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DragulaModule } from 'ng2-dragula';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { MatchDetailsComponent } from './components';
import { SurveyParticipationPageComponent } from './containers';
import { CompanyJobEffects, MatchesEffects } from './effects';
import { MatchesModalRoutingModule } from './matches-modal-routing.module';
import { reducers } from './reducers';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Third Party
    StoreModule.forFeature('matchesModalArea', reducers),
    EffectsModule.forFeature([CompanyJobEffects, MatchesEffects]),
    DragulaModule.forRoot(),

    // Routing
    MatchesModalRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Pages
    SurveyParticipationPageComponent,
    MatchDetailsComponent
  ],
  exports: [
    SurveyParticipationPageComponent,
  ]
})
export class MatchesModalModule { }








