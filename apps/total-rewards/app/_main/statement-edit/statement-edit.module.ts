import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgbDropdownModule, NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { TotalRewardsStatementModule } from 'libs/features/total-rewards/total-rewards-statement';

import { StatementEditRoutingModule } from './statement-edit-routing.module';
import { StatementEditPageComponent } from './statement-edit.page';
import { SettingsPanelComponent } from './components';
import { reducers } from './reducers';
import { StatementEditPageEffects } from './effects/statement-edit.page.effects';
import { QuillToolbarComponent } from './components';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('totalRewards_statementEdit', reducers),
    EffectsModule.forFeature([ StatementEditPageEffects ]),
    FontAwesomeModule,
    NgbButtonsModule,
    NgbDropdownModule,
    ColorPickerModule,

    // Payfactors
    ComboBoxModule,

    PfCommonModule,
    PfCommonUIModule,
    TotalRewardsStatementModule,

    // Routing
    StatementEditRoutingModule
  ],
  declarations: [
    StatementEditPageComponent,
    SettingsPanelComponent,
    QuillToolbarComponent
  ]
})
export class StatementEditModule {
  constructor() {}
}
