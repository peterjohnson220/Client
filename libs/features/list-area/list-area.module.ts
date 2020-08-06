import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ListAreaFilterBooleanComponent } from './components/list-area-filter-boolean';
import { ListAreaFilterDateComponent } from './components/list-area-filter-date';
import { ListAreaFilterNumberComponent } from './components/list-area-filter-number';
import { ListAreaFilterPillsComponent } from './components/list-area-filter-pills';
import { ListAreaFilterSidebarComponent } from './components/list-area-filter-sidebar';
import { ListAreaFilterTextComponent } from './components/list-area-filter-text';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DropDownsModule,
    NumericTextBoxModule,
    DatePickerModule,
    FontAwesomeModule,
  ],
  declarations: [
    ListAreaFilterBooleanComponent,
    ListAreaFilterDateComponent,
    ListAreaFilterNumberComponent,
    ListAreaFilterPillsComponent,
    ListAreaFilterSidebarComponent,
    ListAreaFilterTextComponent,
  ],
  exports: [
    ListAreaFilterBooleanComponent,
    ListAreaFilterDateComponent,
    ListAreaFilterNumberComponent,
    ListAreaFilterPillsComponent,
    ListAreaFilterSidebarComponent,
    ListAreaFilterTextComponent,
    DropDownsModule,
    NumericTextBoxModule,
    DatePickerModule,
  ],
})

export class PfListAreaModule {}
