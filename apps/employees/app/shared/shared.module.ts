import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

import { PfFormsModule } from 'libs/forms';

import { EmployeeHistoryDatePickerModalComponent } from './components';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    DateInputsModule,

    // Payfactors
    PfFormsModule,
  ],
  declarations: [ EmployeeHistoryDatePickerModalComponent ],
  exports: [ EmployeeHistoryDatePickerModalComponent ],
})
export class SharedModule {
  constructor() {  }
}
