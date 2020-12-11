import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ExportFrequencyComponent, ExportFormatComponent, ExportSchedulesComponent } from './components';
import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    // 3rd Party
    NgbPopoverModule,
    CommonModule,
    DropDownsModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    ExportFrequencyComponent,
    ExportFormatComponent,
    ExportSchedulesComponent
  ],
  declarations: [
    // components
    ExportFrequencyComponent,
    ExportFormatComponent,
    ExportSchedulesComponent
  ]
})
export class ExportSchedulerModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
