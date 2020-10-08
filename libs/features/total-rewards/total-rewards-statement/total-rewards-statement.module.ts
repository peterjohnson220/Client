import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartModule } from '@progress/kendo-angular-charts';
import 'hammerjs';
import { QuillModule } from 'ngx-quill';
import { UploadModule } from '@progress/kendo-angular-upload';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';

import { PfCommonUIModule } from 'libs/ui/common';

import { StringEditorComponent, TotalRewardsStatementComponent } from './components';
import { TrsTitleControlComponent } from './components/trs-title-control/trs-title-control.component';
import { TrsImageControlComponent } from './components/trs-image-control/trs-image-control.component';
import { TrsCalculationControlComponent } from './components/trs-calculation-control/trs-calculation-control.component';
import { TrsChartControlComponent } from './components/trs-chart-control/trs-chart-control.component';
import { TrsSummaryControlComponent } from './components/trs-summary-control/trs-summary-control.component';
import { TrsRichTextControlComponent } from './components/trs-rich-text-control/trs-rich-text-control.component';
import { CompensationFieldPipe } from './pipes/compensation-field-pipe';
import { EffectiveDateComponent } from './components/effective-date/effective-date.component';
import { FooterBarComponent } from './components/footer-bar/footer-bar.component';
import { NoRecordsFoundCallToActionComponent } from './components/no-records-found-call-to-action/no-records-found-call-to-action.component';
import { ModeClassifierDirective } from './directives/pf-mode-classifier-directive';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    HttpClientModule,
    FormsModule,

    // Third Party
    ChartModule,
    QuillModule.forRoot(),
    FontAwesomeModule,
    NgbDropdownModule,
    UploadModule,
    NgbTooltipModule,
    DatePickerModule,

    // Payfactors
    PfCommonUIModule,
  ],
  declarations: [
    StringEditorComponent,
    TotalRewardsStatementComponent,
    TrsTitleControlComponent,
    TrsImageControlComponent,
    TrsCalculationControlComponent,
    TrsChartControlComponent,
    TrsSummaryControlComponent,
    TrsRichTextControlComponent,
    CompensationFieldPipe,
    EffectiveDateComponent,
    FooterBarComponent,
    NoRecordsFoundCallToActionComponent,
    ModeClassifierDirective
  ],
  exports: [
    StringEditorComponent,
    TotalRewardsStatementComponent,
    CompensationFieldPipe,
    FooterBarComponent,
    NoRecordsFoundCallToActionComponent,
    ModeClassifierDirective
  ],
  providers: [
    CurrencyPipe
  ],
})
export class TotalRewardsStatementModule {
  constructor() {}
}