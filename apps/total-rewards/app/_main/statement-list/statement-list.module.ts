import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import { GridModule } from '@progress/kendo-angular-grid';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import {PfCommonModule} from 'libs/core';
import {PfCommonUIModule} from 'libs/ui/common';
import {PfFormsModule} from 'libs/forms';

import {SharedModule} from '../../shared';

import {reducers} from './reducers';
import {StatementListPageEffects} from './effects/statement-list.page.effects';
import {StatementListPageComponent} from './statement-list.page';
import {StatementsGridComponent} from './containers/statements-grid';
import {GridActionMenuComponent} from './components/grid-action-menu/grid-action-menu.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('totalRewards_statementList', reducers),
    EffectsModule.forFeature([StatementListPageEffects]),
    FontAwesomeModule,
    GridModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    SharedModule,
  ],
  declarations: [
    StatementListPageComponent,
    StatementsGridComponent,
    GridActionMenuComponent,
  ],
  exports: [
    StatementListPageComponent,
    StatementsGridComponent
  ]
})
export class StatementListModule {
  constructor() {}
}
