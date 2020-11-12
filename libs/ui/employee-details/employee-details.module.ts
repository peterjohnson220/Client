import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { EmplyeeInfoComponent } from './components/emplyee-info/emplyee-info.component';
import { PfCommonModule } from '../../core';



@NgModule({
  declarations: [
    // Feature
    EmployeeDetailsComponent,
    EmplyeeInfoComponent
  ],
  exports: [
    EmployeeDetailsComponent
  ],
  imports: [
    // Angular
    CommonModule,

    // Payfactors
    PfCommonModule
  ]
})
export class EmployeeDetailsModule {
  constructor() {}
}
