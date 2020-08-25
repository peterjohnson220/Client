import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import { GridModule } from '@progress/kendo-angular-grid';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgbTabsetModule, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';

import {PfCommonUIModule} from 'libs/ui/common';
import {PfFormsModule} from 'libs/forms';

import {reducers} from './reducers';
import {StatementGridEffects, TemplateSelectorEffects} from './effects';
import {StatementListPageComponent} from './statement-list.page';
import {StatementsGridComponent, TemplateCardSelectorComponent} from './containers';
import {GridActionMenuComponent} from './components';
import {StatementListRoutingModule} from './statement-list-routing.module';
import * as fromTrsShared from '../../shared';

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

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    fromTrsShared.SharedModule,

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
