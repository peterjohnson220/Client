import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PDFExportModule } from '@progress/kendo-angular-pdf-export';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';
import { TotalRewardsStatementModule } from 'libs/features/total-rewards';

import { StatementViewComponent } from './components';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    FontAwesomeModule,
    PDFExportModule,

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
  constructor() {}
}
