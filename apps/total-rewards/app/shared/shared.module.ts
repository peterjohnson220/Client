import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';
import { TotalRewardsStatementModule } from 'libs/features/total-rewards';
import * as fromFaIcons from 'libs/features/total-rewards/total-rewards-statement/fa-icons';

import { StatementViewComponent } from './components';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    FontAwesomeModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    TotalRewardsStatementModule,
  ],
  declarations: [
    StatementViewComponent
  ],
  exports: [
    StatementViewComponent
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
