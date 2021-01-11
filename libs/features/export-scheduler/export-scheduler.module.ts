import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { ExportFrequencyComponent, ExportFormatComponent } from './components';
import * as fromFaIcons from './fa-icons';
import { PfCommonModule } from '../../core';

@NgModule({
  imports: [
    // 3rd Party
    NgbPopoverModule,
    CommonModule,
    DropDownsModule,
    FontAwesomeModule,
    FormsModule,

    // Payfactors
    PfCommonUIModule,
    PfCommonModule,
    PfFormsModule
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
export class ExportSchedulerModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
