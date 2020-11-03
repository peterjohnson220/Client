import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';
import { TotalRewardsStatementModule } from 'libs/features/total-rewards';

import { reducers } from './reducers';
import { StatementViewRoutingModule } from './statement-view-routing.module';
import { StatementViewPageComponent } from './statement-view.page';
import { StatementViewPageEffects } from './effects/statement-view.page.effects';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('totalRewards_statementView', reducers),
    EffectsModule.forFeature([StatementViewPageEffects]),
    FontAwesomeModule,
    PDFExportModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    TotalRewardsStatementModule,
    SharedModule,

    // Routing
    StatementViewRoutingModule
  ],
  declarations: [
    StatementViewPageComponent
  ]
})
export class StatementViewModule {
  constructor() {}
}
