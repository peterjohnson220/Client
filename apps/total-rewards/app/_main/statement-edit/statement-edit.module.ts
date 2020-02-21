import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import {PfCommonModule} from 'libs/core';
import {PfCommonUIModule} from 'libs/ui/common';

import {SharedModule} from '../../shared';

import {StatementEditPageComponent} from './statement-edit.page';

import {reducers} from './reducers';
import {StatementEditPageEffects} from './effects/statement-edit.page.effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('totalRewards_statementEdit', reducers),
    EffectsModule.forFeature([StatementEditPageEffects]),
    FontAwesomeModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    SharedModule
  ],
  declarations: [
    StatementEditPageComponent
  ],
  exports: [
    StatementEditPageComponent
  ]
})
export class StatementEditModule {
  constructor() {}
}
