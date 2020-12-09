import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ExportFrequencyComponent, ExportFormatComponent } from './components';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    // 3rd Party
    NgbPopoverModule,
    CommonModule,
    DropDownsModule,
    FontAwesomeModule,
    FormsModule
  ],
  exports: [
    ExportFrequencyComponent,
    ExportFormatComponent
  ],
  declarations: [
    // components
    ExportFrequencyComponent,
    ExportFormatComponent
  ]
})
export class ExportSchedulerModule { }
