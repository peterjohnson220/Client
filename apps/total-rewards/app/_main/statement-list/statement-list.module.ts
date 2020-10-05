import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import { GridModule } from '@progress/kendo-angular-grid';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgbTabsetModule, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from '@progress/kendo-angular-tooltip';

import {PfCommonUIModule} from 'libs/ui/common';
import {PfFormsModule} from 'libs/forms';
import * as fromTrsStatement from 'libs/features/total-rewards/total-rewards-statement';

import {reducers} from './reducers';
import {StatementGridEffects, TemplateSelectorEffects} from './effects';
import {StatementListPageComponent} from './statement-list.page';
import {StatementsGridComponent, TemplateCardSelectorComponent} from './containers';
import {GridActionMenuComponent} from './components';
import {StatementListRoutingModule} from './statement-list-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('totalRewards_statementList', reducers),
    EffectsModule.forFeature([StatementGridEffects, TemplateSelectorEffects]),
    FontAwesomeModule,
    GridModule,
    NgbTabsetModule,
    NgbDropdownModule,
    TooltipModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    fromTrsStatement.TotalRewardsStatementModule,

    // Routing,
    StatementListRoutingModule
  ],
  declarations: [
    GridActionMenuComponent,
    StatementListPageComponent,
    StatementsGridComponent,
    TemplateCardSelectorComponent
  ],
  exports: []
})
export class StatementListModule {
  constructor() {}
}
