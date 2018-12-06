import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';

import { PfCommonUIModule } from 'libs/ui/common';

import { SurveyParticipationPageComponent } from './containers';
import { MatchesModalRoutingModule } from './matches-modal-routing.module';
import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { MatchDetailsComponent } from './components/match-details';
import { CompanyJobEffects, MatchesEffects } from './effects';
import { reducers } from './reducers';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

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
  ]
})
export class MatchesModalModule { }








