import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import { GridModule } from '@progress/kendo-angular-grid';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';

import {PfCommonModule} from 'libs/core';
import {PfCommonUIModule} from 'libs/ui/common';
import {PfFormsModule} from 'libs/forms';

import {SharedModule} from '../../shared';

import {reducers} from './reducers';
import {StatementGridEffects} from './effects';
import {StatementListPageComponent} from './statement-list.page';
import {StatementsGridComponent} from './containers';
import {CreateNewStatementBannerComponent, GridActionMenuComponent} from './components';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('totalRewards_statementList', reducers),
    EffectsModule.forFeature([StatementGridEffects]),
    FontAwesomeModule,
    GridModule,
    NgbTabsetModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    SharedModule,
  ],
  declarations: [
    CreateNewStatementBannerComponent,
    GridActionMenuComponent,
    StatementListPageComponent,
    StatementsGridComponent
  ],
  exports: []
})
export class StatementListModule {
  constructor() {}
}
