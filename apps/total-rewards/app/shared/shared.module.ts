import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartModule } from '@progress/kendo-angular-charts';
import { DragulaModule } from 'ng2-dragula';
import 'hammerjs';
import { QuillModule } from 'ngx-quill';

import { PfCommonUIModule } from 'libs/ui/common';

import { InlineStringEditorComponent, TotalRewardsStatementComponent, TotalRewardsItemWellComponent } from './components';
import { TrsTitleControlComponent } from './components/trs-title-control/trs-title-control.component';
import { TrsImageControlComponent } from './components/trs-image-control/trs-image-control.component';
import { TrsCalculationControlComponent } from './components/trs-calculation-control/trs-calculation-control.component';
import { TrsChartControlComponent } from './components/trs-chart-control/trs-chart-control.component';
import { TrsSummaryControlComponent } from './components/trs-summary-control/trs-summary-control.component';
import { TrsRichTextControlComponent } from './components/trs-rich-text-control/trs-rich-text-control.component';
import { CompensationFieldPipe } from './pipes/compensation-field-pipe';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    HttpClientModule,
    FormsModule,

    // Third Party
    ChartModule,
    DragulaModule.forRoot(),
    QuillModule.forRoot(),
    FontAwesomeModule,
    NgbDropdownModule,

    // Payfactors
    PfCommonUIModule,
  ],
  declarations: [
    InlineStringEditorComponent,
    TotalRewardsStatementComponent,
    TotalRewardsItemWellComponent,
    TrsTitleControlComponent,
    TrsImageControlComponent,
    TrsCalculationControlComponent,
    TrsChartControlComponent,
    TrsSummaryControlComponent,
    TrsRichTextControlComponent,
    CompensationFieldPipe,
  ],
  exports: [
    InlineStringEditorComponent,
    TotalRewardsStatementComponent,
    TotalRewardsItemWellComponent,
    CompensationFieldPipe,
  ],
  providers: [
    CurrencyPipe
  ],
})
export class SharedModule {
  constructor() {}
}
