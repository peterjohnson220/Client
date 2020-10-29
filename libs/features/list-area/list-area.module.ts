import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import * as fromFaIcons from './fa-icons';
import {
  ListAreaFilterBooleanComponent,
  ListAreaFilterDateComponent,
  ListAreaFilterNumberComponent,
  ListAreaFilterPillsComponent,
  ListAreaFilterSidebarComponent,
  ListAreaFilterTextComponent,
  ListAreaColumnChooserComponent
} from './components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DropDownsModule,
    NumericTextBoxModule,
    DatePickerModule,
    FontAwesomeModule,
    NgbModule,

    PfCommonModule,
    PfFormsModule,
    PfCommonUIModule
  ],
  declarations: [
    ListAreaFilterBooleanComponent,
    ListAreaFilterDateComponent,
    ListAreaFilterNumberComponent,
    ListAreaFilterPillsComponent,
    ListAreaFilterSidebarComponent,
    ListAreaFilterTextComponent,
    ListAreaColumnChooserComponent
  ],
  exports: [
    ListAreaFilterBooleanComponent,
    ListAreaFilterDateComponent,
    ListAreaFilterNumberComponent,
    ListAreaFilterPillsComponent,
    ListAreaFilterSidebarComponent,
    ListAreaFilterTextComponent,
    ListAreaColumnChooserComponent,
    DropDownsModule,
    NumericTextBoxModule,
    DatePickerModule
  ],
})

export class PfListAreaModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
