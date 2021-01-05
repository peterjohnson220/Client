import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';

import { ListAreaFilterBooleanComponent,
         ListAreaFilterDateComponent,
         ListAreaFilterNumberComponent,
         ListAreaFilterTextComponent } from './components';
import { ListAreaFilterSidebarComponent } from './list-area-filter-sidebar';
import { PfFormsModule } from '../../../forms';
import { PfCommonUIModule } from '../../common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PfCommonModule } from '../../../core';



@NgModule({
  declarations: [
    ListAreaFilterBooleanComponent,
    ListAreaFilterDateComponent,
    ListAreaFilterNumberComponent,
    ListAreaFilterTextComponent,
    ListAreaFilterSidebarComponent
  ],
  imports: [
    CommonModule,
    DropDownsModule,
    DatePickerModule,
    NumericTextBoxModule,
    FormsModule,
    NgbModule,
    FontAwesomeModule,

    PfCommonModule,
    PfFormsModule,
    PfCommonUIModule
  ],
  exports: [
    ListAreaFilterSidebarComponent
  ]
})
export class PfListAreaFilterSidebarModule { }
