import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartModule } from '@progress/kendo-angular-charts';
import 'hammerjs';
import { QuillModule } from 'ngx-quill';
import { UploadModule } from '@progress/kendo-angular-upload';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';

import {
  StringEditorComponent, TotalRewardsStatementComponent, StatementDownloadComponent,
  FieldGroupComponent, TrsCompensationFieldsChooserComponent, StatementViewComponent,
  TrsEmployeeControlComponent
} from './components';
import { TrsTitleControlComponent } from './components/trs-title-control/trs-title-control.component';
import { TrsImageControlComponent } from './components/trs-image-control/trs-image-control.component';
import { TrsCalculationControlComponent } from './components/trs-calculation-control/trs-calculation-control.component';
import { TrsChartControlComponent } from './components/trs-chart-control/trs-chart-control.component';
import { TrsSummaryControlComponent } from './components/trs-summary-control/trs-summary-control.component';
import { TrsRichTextControlComponent } from './components/trs-rich-text-control/trs-rich-text-control.component';
import { CompensationFieldPipe } from './pipes/compensation-field-pipe';
import { TrsEffectiveDateControlComponent } from './components/trs-effective-date-control/trs-effective-date-control.component';
import { FooterBarComponent } from './components/footer-bar/footer-bar.component';
import { ModeClassifierDirective } from './directives/pf-mode-classifier-directive';
import { StatementGraphicsDirective } from './directives/pf-statement-graphics-directive';

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
    PDFExportModule,
    NgbModule,

    // Payfactors
    PfCommonUIModule,
    PfCommonModule,
    PfFormsModule
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
    TrsEffectiveDateControlComponent,
    FooterBarComponent,
    ModeClassifierDirective,
    StatementGraphicsDirective,
    StatementDownloadComponent,
    FieldGroupComponent,
    TrsCompensationFieldsChooserComponent,
    StatementViewComponent,
    TrsEmployeeControlComponent
  ],
  exports: [
    StringEditorComponent,
    TotalRewardsStatementComponent,
    CompensationFieldPipe,
    FooterBarComponent,
    ModeClassifierDirective,
    StatementGraphicsDirective,
    StatementDownloadComponent,
    StatementViewComponent
  ],
  providers: [
    CurrencyPipe
  ],
})
export class TotalRewardsStatementModule {
  constructor() {}
}
