import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { GridModule } from '@progress/kendo-angular-grid';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PfCommonUIModule } from 'libs/ui/common';
import * as fromFaIcons from 'libs/features/total-rewards/total-rewards-statement/fa-icons';

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
    NgbDropdownModule,
    FontAwesomeModule,
    StoreModule.forFeature('totalRewards_statementHistory', reducers),
    EffectsModule.forFeature([
      effects.StatementHistoryPageEffects
    ]),
    GridModule,
    TooltipModule
  ]
})

export class StatementHistoryModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
