import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { PfCommonModule } from '../../core';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { EmplyeeInfoComponent } from './components/emplyee-info/emplyee-info.component';




@NgModule({
  declarations: [
    // Feature
    EmployeeDetailsComponent,

    // Components
    EmplyeeInfoComponent
  ],
  exports: [
    EmployeeDetailsComponent,
  ],
  imports: [
    // Angular
    CommonModule,

    // Payfactors
    PfCommonModule,
    PerfectScrollbarModule
  ]
})
export class EmployeeDetailsModule {
  constructor() {}
}
