import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';
import { TotalRewardsStatementModule } from 'libs/features/total-rewards/total-rewards-statement';

import { StatementPrintRoutingModule } from './statement-print-routing.module';
import { StatementPrintPageComponent } from './statement-print.page';
import { reducers } from './reducers';
import { StatementPrintPageEffects } from './effects/statement-print.page.effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('totalRewards_statementPrint', reducers),
    EffectsModule.forFeature([ StatementPrintPageEffects ]),
    FontAwesomeModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    TotalRewardsStatementModule,

    // Routing
    StatementPrintRoutingModule
  ],
  declarations: [
    StatementPrintPageComponent
  ]
})
export class StatementPrintModule {
  constructor() { }
}
