import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PfCommonUIModule } from 'libs/ui/common';

import * as effects from './effects';
import { reducers } from './reducers';
import { StatementHistoryRoutingModule } from './statement-history-routing.module';
import { StatementHistoryPageComponent } from './statement-history.page';

@NgModule({
  declarations: [
    StatementHistoryPageComponent
  ],
  imports: [
    CommonModule,
    StatementHistoryRoutingModule,
    PfCommonUIModule,

    // 3rd Party
    StoreModule.forFeature('totalRewards_statementHistory', reducers),
    EffectsModule.forFeature([
      effects.StatementHistoryPageEffects
    ])
  ]
})

export class StatementHistoryModule { }
